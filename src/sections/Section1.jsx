import { useState } from "react";
import { open } from "@tauri-apps/api/dialog";
import axios from "axios";
import { toast } from "react-toastify";

export default function Section1() {
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    rows: 0,
    cols: 0,
    width: 0,
    height: 0,
    output: "",
    image: null,
  });
  const [formData2, setFormData2] = useState({
    gridCellFolder: "",
    inputFolder: "",
    outputFolder: "",
    opacity: 0.6,
  });

  const handleSelectFolder = async (folder) => {
    try {
      const selectedPath = await open({
        directory: true,
        multiple: false,
      });
      if (selectedPath) {
        if(folder=='output') setFormData({ ...formData, output: selectedPath });
        else if(folder=='gridCellFolder')  setFormData2({ ...formData2, gridCellFolder: selectedPath });
        else if(folder=='inputFolder') setFormData2({ ...formData2, inputFolder: selectedPath });
        else if(folder=='outputFolder') setFormData2({ ...formData2, outputFolder: selectedPath });
      }
    } catch (error) {
      console.error("Error selecting folder:", error);
    }
  };

  const handleClick = async () => {
    setLoading(true);
    try {
      const formDataToSend = new FormData();
      formDataToSend.append("rows", formData.rows);
      formDataToSend.append("cols", formData.cols);
      formDataToSend.append("output", formData.output);
      formDataToSend.append("image", formData.image);
      const response = await axios.post(
        "http://127.0.0.1:8000/mosaic",
        formDataToSend
      );
      console.log("Response:", response.data);
      toast.success("Form Submitted successfully!");

      await axios.post('http://localhost:8000/backdrop', {
        rows: parseInt(formData.rows),
        cols: parseInt(formData.cols),
        width: parseInt(formData.width),
        height: parseInt(formData.height),
      });
      toast.success("Backdrop Image Added successfully!");
      setFormData({
        rows: 0,
        cols: 0,
        output: "",
        image: null,
      });
      setPage(2);
    } catch (error) {
      console.error("Error:", error);
      toast.error("Error submitting form. Please try again.");
    } finally{
      setLoading(false);
    }
  };

  const handleClick2 = async () => {
    setLoading(true);
    try {
      const formDataToSend = new FormData();
      formDataToSend.append("gridCellFolder", formData2.gridCellFolder);
      formDataToSend.append("inputFolder", formData2.inputFolder);
      formDataToSend.append("outputFolder", formData2.outputFolder);
      formDataToSend.append("opacity", formData2.opacity);
      const response = await axios.post(
        "http://127.0.0.1:8000/start-overlay",
        formDataToSend
      );
      console.log("Response:", response.data);
      toast.success("Server Is Ready!");
      setFormData({
        rows: 0,
        cols: 0,
        output: "",
        image: null,
      });
      setPage(3);
    } catch (error) {
      console.error("Error:", error);
      toast.error("Error submitting form. Please try again.", {
        position: toast.POSITION.TOP_RIGHT,
      });
    } finally{
      setLoading(false);
    }
  };

  return (
    <div
      style={{ display: "flex", justifyContent: "center", padding: "3rem 0" }}
    >
      {page === 1 && (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            rowGap: "20px",
            justifyContent: "center",
          }}
        >
          <div>
            <p style={{ color: "rgb(189, 189, 189)", margin: 3 }}>
              Enter Number of Rows
            </p>
            <input
              type="number"
              onChange={(e) =>
                setFormData({ ...formData, rows: e.target.value })
              }
            />
          </div>
          <div>
            <p style={{ color: "rgb(189, 189, 189)", margin: 3 }}>
              Enter Number of Columns
            </p>
            <input
              type="number"
              onChange={(e) =>
                setFormData({ ...formData, cols: e.target.value })
              }
            />
          </div>
          <div>
            <p style={{ color: "rgb(189, 189, 189)", margin: 3 }}>
              Enter Width
            </p>
            <input
              type="number"
              onChange={(e) =>
                setFormData({ ...formData, width: e.target.value })
              }
            />
          </div>
          <div>
            <p style={{ color: "rgb(189, 189, 189)", margin: 3 }}>
              Enter Height
            </p>
            <input
              type="number"
              onChange={(e) =>
                setFormData({ ...formData, height: e.target.value })
              }
            />
          </div>
          <div>
            <button style={{ width: "236px" }} onClick={()=>handleSelectFolder('output')}>
              Select Grid Cell Folder
            </button>
            <p
              style={{
                color: "rgb(189, 189, 189)",
                margin: 3,
                padding: 0,
                fontSize: "14px",
              }}
            >
              {formData.output}
            </p>
          </div>
          <div>
            <input
              type="file"
              id="fileInput"
              onChange={(e) => {
                setFormData({ ...formData, image: e.target.files[0] });
              }}
              style={{ display: "none" }}
            />
            <button
              type="button"
              style={{ width: "236px" }}
              onClick={() => document.getElementById("fileInput").click()}
            >
              Choose Mosaic Image
            </button>
            <p
              style={{
                color: "rgb(189, 189, 189)",
                padding: 0,
                fontSize: "14px",
                margin: 3,
              }}
            >
              {formData.image?.name}
            </p>
          </div>
          <div>
            <button
              style={{ backgroundColor: "#0F52BA",width: "236px" }}
              onClick={handleClick}
              disabled={loading}
            >
              {loading?'Please Wait ...':'Submit'}
            </button>
          </div>
        </div>
      )}
      {page === 2 && (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            rowGap: "20px",
            justifyContent: "center",
          }}
        >
            <div>
              <p style={{ color: "rgb(189, 189, 189)", margin: 3 }}>Enter Opacity</p>
              <input
                type="number"
                onChange={(e) =>
                  setFormData2({ ...formData2, opacity: e.target.value })
                }
              />
            </div>
          <div >
            <button style={{ width: "236px" }} onClick={()=>handleSelectFolder('gridCellFolder')}>
              Select Grid Cell Folder
            </button>
            <p style={{
                color: "rgb(189, 189, 189)",
                margin: 3,
                padding: 0,
                fontSize: "14px",
              }} > {formData2.gridCellFolder}</p>
          </div>
          <div>
            <button style={{ width: "236px" }} onClick={()=>handleSelectFolder('inputFolder')}>Select Input Folder</button>
            <p style={{
                color: "rgb(189, 189, 189)",
                margin: 3,
                padding: 0,
                fontSize: "14px",
              }}> {formData2.inputFolder}</p>
          </div>
          <div>
            <button style={{ width: "236px" }} onClick={()=>handleSelectFolder('outputFolder')}>Select Output Folder</button>
            <p style={{
                color: "rgb(189, 189, 189)",
                margin: 3,
                padding: 0,
                fontSize: "14px",
              }}> {formData2.outputFolder}</p>
          </div>
          <button style={{ width: "236px", backgroundColor: "#0F52BA" }} onClick={handleClick2} disabled={loading}>
          {loading?'Please Wait ...':'Submit'}
            </button>
        </div>
      )}
      {page === 3 && (
        <div style={{display:"flex", flexDirection:"column",justifyContent:"center", alignItems:"center"}}>
        <p
          style={{
            display: "flex",
            justifyContent: "center",
            alignSelf: "center",
            alignItems: "center",
            color: "White",
            fontSize:"1.2rem",
            textAlign:"center",
            lineHeight:"50px"
          }}
        >
          Server Is Ready !! <br /> Start Adding Pictures in Input Folder
        </p>
        <button style={{ width: "236px", backgroundColor: "#0F52BA" }} onClick={()=>window.location.reload()} disabled={loading}>
          Regenerate
         </button>
        </div>
      )}
    </div>
  );
}
