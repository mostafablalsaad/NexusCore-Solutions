import React, { useState, useRef, useCallback } from 'react';

interface UploadResponse {
  success: boolean;
  imageUrl: string;
  filename: string;
  originalname: string;
}

const ImageUpload: React.FC = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [uploadResult, setUploadResult] = useState<UploadResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  //this is allow the user to select file from the file system
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Handle file selection
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {

    const file = e.target.files?.[0] || null;
    console.log("this is the file ",file);
    
    processFile(file);
  };

  // Handle drag & drop
  const handleDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    //clean the dragover class
    e.currentTarget.classList.remove('dragover');
    
    //get the first file from the dropped files 
    const file = e.dataTransfer.files?.[0] || null;

    processFile(file);
  }, []);

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    //add dragover class to the div
    e.currentTarget.classList.add('dragover');
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    //remove dragover class from the div
    e.currentTarget.classList.remove('dragover');
  };

  const processFile = (file: File | null) => {
    setError(null);
    setUploadResult(null);

    if (!file) return;

    // Validate file
    if (!file.type.startsWith('image/')) {
      setError('❌ Please select an image (JPG, PNG, GIF).');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setError('❌ File too large. Max size: 5MB.');
      return;
    }

    setSelectedFile(file);
    
    // Create preview
    const reader = new FileReader();
    reader.onload = (e) => {
      setPreviewUrl(e.target?.result as string);
    };
    reader.readAsDataURL(file);
  };

  // Trigger file input
  const handleClick = () => {
    fileInputRef.current?.click();
  };

  // Upload to backend
  const handleUpload = async () => {
    if (!selectedFile) return;

    setUploading(true);
    setProgress(0);
    setError(null);

    const formData = new FormData();
    formData.append('image', selectedFile);

    try {
      const xhr = new XMLHttpRequest();
      
      // Track progress
      xhr.upload.onprogress = (e) => {
        if (e.lengthComputable) {
          const percent = Math.round((e.loaded / e.total) * 100);
          setProgress(percent);
        }
      };

      // Handle response
      xhr.onload = () => {
        setUploading(false);
        if (xhr.status === 200) {
          const result: UploadResponse = JSON.parse(xhr.responseText);
          setUploadResult(result);
          setError(null);
        } else {
          setError(`Upload failed: ${xhr.statusText}`);
        }
      };

      xhr.onerror = () => {
        setUploading(false);
        setError('❌ Network error. Please try again.');
      };

      xhr.open('POST', 'http://localhost:5000/api/auth/upload-image');
      xhr.send(formData);
    } catch (err) {
      setUploading(false);
      setError(`Upload error: ${err instanceof Error ? err.message : 'Unknown'}`);
    }
  };

  const reset = () => {
    setSelectedFile(null);
    setPreviewUrl(null);
    setUploadResult(null);
    setError(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800">🖼️ Image Upload</h1>
        <p className="text-gray-600 mt-2">Upload JPG, PNG, or GIF (max 5MB)</p>
      </div>

      <div 
        className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center transition-all duration-300 hover:border-blue-500 hover:bg-blue-50 cursor-pointer"
        onClick={handleClick}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
      >
        <div className="text-5xl mb-4">📁</div>
        <h2 className="text-xl font-semibold text-gray-700 mb-2">
          {selectedFile ? selectedFile.name : 'Drag & Drop or Click to Upload'}
        </h2>
        <p className="text-gray-500 mb-4">
          Supports: JPG, PNG, GIF • Max 5MB
        </p>
        <button 
          type="button"
          className="bg-blue-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-blue-700 transition"
        >
          📂 Choose File
        </button>
        <input
          type="file"
          //in the ref we are linking the file input to the button above
          //then the e or the event will be triggered on the file input change
          ref={fileInputRef}
          //on the change we call the handleFileChange function that process the file
          onChange={handleFileChange}
          accept="image/jpeg, image/png, image/gif"
          className="hidden"
        />
      </div>

      {error && (
        <div className="mt-4 p-3 bg-red-100 text-red-700 rounded-lg">
          {error}
        </div>
      )}

      {previewUrl && (
        <div className="mt-6">
          <h3 className="font-medium text-gray-700 mb-2">Preview</h3>
          <img 
            src={previewUrl} 
            alt="Preview" 
            className="max-w-full h-auto rounded-lg shadow-md"
          />
        </div>
      )}

      {selectedFile && !uploadResult && (
        <button
          onClick={handleUpload}
          disabled={uploading}
          className={`mt-6 w-full py-3 px-4 rounded-lg font-semibold text-white ${
            uploading 
              ? 'bg-gray-500 cursor-not-allowed' 
              : 'bg-green-600 hover:bg-green-700'
          }`}
        >
          {uploading ? (
            <div className="flex items-center justify-center">
              <span>📤 Uploading... {progress}%</span>
              <div className="ml-3 w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            </div>
          ) : (
            '🚀 Upload Image'
          )}
        </button>
      )}

      {uploading && (
        <div className="mt-4">
          <div className="w-full bg-gray-200 rounded-full h-2.5">
            <div 
              className="bg-green-600 h-2.5 rounded-full" 
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        </div>
      )}

      {uploadResult && (
        <div className="mt-6 p-4 bg-green-50 rounded-lg border border-green-200">
          <div className="flex items-start">
            <span className="text-green-500 text-xl mr-2">✅</span>
            <div>
              <h3 className="font-semibold text-green-800">Upload Successful!</h3>
              <p className="text-green-700 mt-1">
                <a 
                  href={uploadResult.imageUrl} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline"
                >
                  View uploaded image
                </a>
              </p>
              <button
                onClick={reset}
                className="mt-3 text-sm bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700"
              >
                Upload Another
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ImageUpload;