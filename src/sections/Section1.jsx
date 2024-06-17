import { useState } from "react";
import { open } from "@tauri-apps/api/dialog";
import axios from "axios";
import { toast } from "react-toastify";

export default function Section1() {
  const [page, setPage] = useState(1);
  const [formData, setFormData] = useState({
    rows: 0,
    cols: 0,
    output: "",
    image: null,
  });
  const [formData2, setFormData2] = useState({
    gridCellFolder:  "",
    inputFolder:  "",
    outputFolder: "",
    opacity: 0.6,
  });

  const handleSelectFolder = async () => {
    try {
      const selectedPath = await open({
        directory: true,
        multiple: false,
      });
      if (selectedPath) {
        setFormData({ ...formData, output: selectedPath });
      }
    } catch (error) {
      console.error("Error selecting folder:", error);
    }
  };

  const handleSelectFolder2 = async () => {
    try {
      const selectedPath = await open({
        directory: true,
        multiple: false,
      });
      if (selectedPath) {
        setFormData2({ ...formData2, gridCellFolder: selectedPath });
      }
    } catch (error) {
      console.error("Error selecting folder:", error);
    }
  };
  const handleSelectFolder3 = async () => {
    try {
      const selectedPath = await open({
        directory: true,
        multiple: false,
      });
      if (selectedPath) {
        setFormData2({ ...formData2, inputFolder: selectedPath });
      }
    } catch (error) {
      console.error("Error selecting folder:", error);
    }
  };
  const handleSelectFolder4 = async () => {
    try {
      const selectedPath = await open({
        directory: true,
        multiple: false,
      });
      if (selectedPath) {
        setFormData2({ ...formData2, outputFolder: selectedPath });
      }
    } catch (error) {
      console.error("Error selecting folder:", error);
    }
  };

  const handleClick = async () => {
    try {
      const formDataToSend = new FormData();
      formDataToSend.append("rows", formData.rows);
      formDataToSend.append("cols", formData.cols);
      formDataToSend.append("output", formData.output);
      formDataToSend.append("image", formData.image);
      const response = await axios.post(
        "http://127.0.0.1:3000/mosaic",
        formDataToSend
      );
      console.log("Response:", response.data);
      toast.success("Form submitted successfully!");
      setFormData({
        rows: 0,
        cols: 0,
        output: "",
        image: null,
      });
      setPage(2);
    } catch (error) {
      console.error("Error:", error);
      toast.error("Error submitting form. Please try again.", {
        position: toast.POSITION.TOP_RIGHT,
      });
    }
  };
  const handleClick2 = async () => {
    try {
      const formDataToSend = new FormData();
      formDataToSend.append("gridCellFolder", formData2.gridCellFolder);
      formDataToSend.append("inputFolder", formData2.inputFolder);
      formDataToSend.append("outputFolder", formData2.outputFolder);
      formDataToSend.append("opacity", formData2.opacity);
      const response = await axios.post(
        "http://127.0.0.1:3000/start-overlay",
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
    }
  };

  return (
    <>
      {page === 1 && (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            rowGap: 10,
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <div
            style={{
              display: "flex",
              columnGap: 10,
              justifyContent: "center",
              alignItems: "center",
              height: "100%",
            }}
          >
            <div>
              <p style={{ color: "gray", margin: 0 }}>Enter Number of Rows</p>
              <input
                type="number"
                style={{ width: "200px" }}
                onChange={(e) =>
                  setFormData({ ...formData, rows: e.target.value })
                }
              />
            </div>
            <div>
              <p style={{ color: "gray", margin: 0 }}>
                Enter Number of Columns
              </p>
              <input
                type="number"
                style={{ width: "200px" }}
                onChange={(e) =>
                  setFormData({ ...formData, cols: e.target.value })
                }
              />
            </div>
          </div>
          <div style={{ display: "flex", columnGap: 10 }}>
            <button onClick={handleSelectFolder}>Select Folder</button>
            <p style={{ color: "GrayText" }}> {formData.output}</p>
          </div>
          <div>
            <input
              type="file"
              onChange={(e) => {
                setFormData({ ...formData, image: e.target.files[0] });
              }}
            />
          </div>
          <button onClick={handleClick}>Submit</button>
        </div>
      )}
      {page === 2 && (
        <div
        style={{
          display: "flex",
          flexDirection: "column",
          rowGap: 10,
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <div
          style={{
            display: "flex",
            columnGap: 10,
            justifyContent: "center",
            alignItems: "center",
            height: "100%",
          }}
        >
          <div>
            <p style={{ color: "gray", margin: 0 }}>Enter Opacity</p>
            <input
              type="number"
              style={{ width: "200px" }}
              onChange={(e) =>
                setFormData2({ ...formData2, opacity: e.target.value })
              }
            />
          </div>
        </div>
        <div style={{ display: "flex", columnGap: 10 }}>
          <button onClick={handleSelectFolder2}>Select Grid Cell Folder</button>
          <p style={{ color: "GrayText" }}> {formData2.gridCellFolder}</p>
        </div>
        <div style={{ display: "flex", columnGap: 10 }}>
          <button onClick={handleSelectFolder3}>Select Input Folder</button>
          <p style={{ color: "GrayText" }}> {formData2.inputFolder}</p>
        </div>
        <div style={{ display: "flex", columnGap: 10 }}>
          <button onClick={handleSelectFolder4}>Select Output Folder</button>
          <p style={{ color: "GrayText" }}> {formData2.outputFolder}</p>
        </div>
        <button onClick={handleClick2}>Submit</button>
      </div>
      )}
      {page===3 && <p style={{display:"flex", justifyContent:"center", alignSelf:"center", alignItems:"center",color:"GrayText"}}>Server Is Ready! Start Adding Pinture in Input Folder</p>}
    </>
  );
}
