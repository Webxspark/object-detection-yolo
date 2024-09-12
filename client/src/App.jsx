import { useContext, useRef, useState } from "react"
import { Button } from "./components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./components/ui/card"
import { Input } from "./components/ui/input"
import { Label } from "./components/ui/label"
import { GlobalContext } from "./context/global-context"
import { Loader } from "lucide-react"

function App() {
  const { utils } = useContext(GlobalContext);
  const [file, setFile] = useState(null);
  const [processedImage, setProcessedImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [preview, setPreview] = useState(null);
  const processingRef = useRef(false),
    uploadRef = useRef(false);

  const validateFile = (file) => {
    // check if the file is an image
    if (file.target.files[0].type.split('/')[0] !== 'image') {
      utils.toast.error('Invalid file type. Please upload an image file');
      file.target.value = null;
      return
    }
    // check if file is a svg
    if (file.target.files[0].type === 'image/svg+xml') {
      utils.toast.error('SVG files are not supported');
      file.target.value = null;
      return
    }
    if (file.target.files.length > 0) {
      setFile(file.target.files[0])
    }
    // generate blob url
    const blobUrl = URL.createObjectURL(file.target.files[0]);
    setPreview(blobUrl);
  }

  const handleFormSubmit = e => {
    e.preventDefault();
    if (processingRef.current) return;
    if (!file) {
      utils.toast.error('Please upload an image');
      return
    }
    var formData = new FormData();
    formData.append('image', file);
    setLoading(true);
    processingRef.current = true;

    // make api call to process image
    fetch('/api/detect', {
      method: 'POST',
      body: formData
    }).then(res => res.json())
      .then(resp => {
        if (resp.status == 200) {
          setProcessedImage(resp.image);
          utils.toast.success(resp.message);
        } else {
          utils.toast.error(resp.message);
        }
      }).catch(err => {
        console.error(err);
        utils.toast.error('An error occurred while processing image [D-500]');
      }).finally(() => {
        setLoading(false);
        processingRef.current = false;
      })
  }
  const removeSelectedFile = () => {
    uploadRef.current.value = null;
    setFile(null);
    setPreview(null);
    setProcessedImage(null);
  }
  const downloadProcessedImage = () => {
    // create a link element
    var link = document.createElement('a');
    link.href = `/api/files/${processedImage}`;
    link.download = processedImage;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
  return (
    <div className="m-8">
      <div className="flex items-center justify-center min-h-[90dvh] w-full">
        <div className="lg:max-w-[70%] w-full">
          <Card>
            <CardHeader>
              <CardTitle>Object Detection using YOLOv10</CardTitle>
              <CardDescription>Upload an image to detect objects</CardDescription>
            </CardHeader>
            <CardContent>
              <form className="space-y-3" method="post" encType="multipart/form-data" onSubmit={handleFormSubmit}>
                <div className="space-y-1">
                  <Label>Upload Image</Label>
                  <Input ref={uploadRef} onChange={validateFile} type="file" accept="image/*" />
                </div>
                <div className="flex justify-end">
                  <Button
                    disabled={loading}
                  >
                    Process Image {loading && <Loader className="h-4 w-4 ml-1 animate-spin" />}
                  </Button>
                </div>
              </form>
              <div className="mt-4 grid md:grid-cols-2 gap-4">
                {
                  preview && <div className="relative">
                    <Label>Preview</Label>
                    <img className="w-full rounded-md" src={preview} />
                    <Button onClick={removeSelectedFile} size="custom" className="absolute top-3 right-0 px-1">Remove</Button>
                  </div>
                }
                {
                  processedImage && <div className="relative">
                    <Label>Output</Label>
                    <img
                      className="w-full rounded-md"
                      src={`/api/files/${processedImage}`}
                    />
                    <Button onClick={downloadProcessedImage} size="custom" className="absolute top-3 right-0 px-1">Download</Button>
                  </div>
                }
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

export default App
