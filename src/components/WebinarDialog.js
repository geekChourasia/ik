

import React, { useState, useRef, useEffect } from "react";
import {
  Box,
  Typography,
  TextField,
  Button,
  Grid,
  Card,
  IconButton,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import SupervisorAccountIcon from "@mui/icons-material/SupervisorAccount";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker, TimePicker } from "@mui/x-date-pickers";
import dayjs from "dayjs";
import VideocamOutlinedIcon from "@mui/icons-material/VideocamOutlined";
import AddIcon from "@mui/icons-material/Add";

export default function WebinarDialog({
  open,
  onClose,
  onAddWebinar,
  webinar,
  isEditing,
  onUpdateWebinar,
}) {
  const [value, setValue] = useState(dayjs());
  const [selectedTime, setSelectedTime] = useState(dayjs());
  const [endTime, setEndTime] = useState(dayjs());
  const [instructorName, setInstructorName] = useState("");
  const [instructorRole, setInstructorRole] = useState("");
  const [instructorCompany, setInstructorCompany] = useState("");
  const [topics, setTopics] = useState("");
  const [webinarTitle, setWebinarTitle] = useState("");
  const [image, setImage] = useState(null); // State to store image file

  const [errors, setErrors] = useState({
    instructorName: "",
    instructorRole: "",
    instructorCompany: "",
    topics: "",
    webinarTitle: "",
    startDate: "",
    startTime: "",
    endTime: "",
  });

  const fileInputRef = useRef(null); // Ref to the hidden file input

  const validateForm = () => {
    const newErrors = {
      instructorName: instructorName ? "" : "Instructor Name is required.",
      instructorRole: instructorRole ? "" : "Instructor Role is required.",
      instructorCompany: instructorCompany
        ? ""
        : "Instructor Company is required.",
      topics: topics ? "" : "Topics are required.",
      webinarTitle: webinarTitle ? "" : "Webinar Title is required.",
      startDate: value ? "" : "Start Date is required.",
      startTime: selectedTime ? "" : "Start Time is required.",
      endTime: endTime ? "" : "End Time is required.",
    };

    setErrors(newErrors);

    return !Object.values(newErrors).some((error) => error);
  };
  const resetForm = () => {
    setInstructorName("");
    setInstructorRole("");
    setInstructorCompany("");
    setTopics("");
    setWebinarTitle("");
    setValue(dayjs());
    setSelectedTime(dayjs());
    setEndTime(dayjs());
    setImage(null);
    setErrors({
      instructorName: "",
      instructorRole: "",
      instructorCompany: "",
      topics: "",
      webinarTitle: "",
      startDate: "",
      startTime: "",
      endTime: "",
    });
  };

  useEffect(() => {
    if (isEditing && webinar) {
      setInstructorName(webinar.name);
      setInstructorRole(webinar.position);
      setInstructorCompany(webinar.company);
      setTopics(webinar.skills);
      setWebinarTitle(webinar.title);
      setValue(dayjs(webinar.schedule.split(" ")[0], "DD/MM/YYYY"));
      setSelectedTime(dayjs(webinar.schedule.split(" ")[1], "HH:mm"));
      setEndTime(dayjs(webinar.schedule.split(" ")[3], "HH:mm"));
      setImage(null); // Or set to webinar.avatar if you're handling image editing
    } else {
      resetForm();
    }
  }, [isEditing, webinar]);

  //   const handleCreateWebinar = () => {
  //     if (validateForm()) {
  //       const newWebinar = {
  //         name: instructorName,
  //         title: webinarTitle,
  //         company: instructorCompany,
  //         position: instructorRole,
  //         skills: topics,
  //         schedule: `${value.format("DD/MM/YYYY")} ${selectedTime.format("HH:mm")} - ${endTime.format("HH:mm")}`,
  //         avatar: image ? URL.createObjectURL(image) : "", // Use image URL or placeholder if not available
  //       };

  //       onAddWebinar(newWebinar);
  //       resetForm(); // Reset the form fields

  //       onClose(); // Close the dialog after successful submission
  //     }
  //   };

  const handleCreateOrUpdateWebinar = () => {
    if (validateForm()) {
      const newWebinar = {
        id: webinar ? webinar.id : new Date().getTime(), // use existing ID for editing
        name: instructorName,
        title: webinarTitle,
        company: instructorCompany,
        position: instructorRole,
        skills: topics,
        schedule: `${value.format("DD/MM/YYYY")} ${selectedTime.format(
          "HH:mm"
        )} - ${endTime.format("HH:mm")}`,
        avatar: image
          ? URL.createObjectURL(image)
          : webinar
          ? webinar.avatar
          : "", // Use image URL or placeholder if not available
      };

      if (isEditing) {
        onUpdateWebinar(newWebinar);
      } else {
        onAddWebinar(newWebinar);
      }
      resetForm();
      onClose();
    }
  };

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setImage(file);
    }
  };

  const handleCardClick = () => {
    fileInputRef.current.click(); // Trigger the hidden file input
  };

  return (
    <Dialog
      onClose={onClose}
      open={open}
      sx={{
        "& .MuiDialog-container": {
          "& .MuiPaper-root": {
            width: "100%",
            maxWidth: "700px",
          },
        },
      }}
    >
      <DialogTitle sx={{ m: 0, p: 2 }} id="customized-dialog-title">
        <Typography sx={{ fontSize: "18px", fontWeight: "bold" }}>
          Create Webinar
        </Typography>
        <IconButton
          aria-label="close"
          onClick={onClose}
          sx={{
            position: "absolute",
            right: 8,
            top: 8,
            color: "black",
          }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent dividers>
        <Box display="flex" alignItems="center" mb={2}>
          <SupervisorAccountIcon />
          <Typography sx={{ fontSize: "16px", fontWeight: "bold", ml: 1 }}>
            Instructor Details
          </Typography>
        </Box>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={5} sx={{ ml: 2 }}>
            <Typography sx={{ fontSize: "13px", fontWeight: "bold" }}>
              Instructor Name <span style={{ color: "red" }}>*</span>
            </Typography>
            <TextField
              size="small"
              fullWidth
              placeholder="Type your instructor name"
              sx={{ mt: 1, mb: 1 }}
              value={instructorName}
              onChange={(e) => setInstructorName(e.target.value)}
              error={!!errors.instructorName}
              helperText={errors.instructorName}
            />
            <Typography sx={{ fontSize: "13px", fontWeight: "bold" }}>
              Instructor Role <span style={{ color: "red" }}>*</span>
            </Typography>
            <TextField
              size="small"
              fullWidth
              placeholder="Type your instructor role"
              sx={{ mt: 1 }}
              value={instructorRole}
              onChange={(e) => setInstructorRole(e.target.value)}
              error={!!errors.instructorRole}
              helperText={errors.instructorRole}
            />
          </Grid>
          <Grid
            item
            xs={12}
            sm={5}
            container
            justifyContent="center"
            alignItems="center"
          >
            <Box>
              <Typography sx={{ fontSize: "13px", fontWeight: "bold" }}>
                Instructor Image <span style={{ color: "red" }}>*</span>
              </Typography>
              <Card
              sx={{
                width: "100px",
                height: "100px",
                mt: 1,
                mb: 0,
                position: "relative",
                cursor: "pointer",
                border: "2px dashed grey", // Dashed border
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
              onClick={handleCardClick} // Trigger file input click on card click
            >
              {image ? (
                <img
                  src={URL.createObjectURL(image)}
                  alt="Instructor"
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                  }}
                />
              ) : (
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    width: "100%",
                    height: "100%",
                cursor: "pointer",

                  }}
                >
                  <IconButton
                    sx={{
                      color: "grey",
                      fontSize: "2rem",
                    }}
                  >
                    <AddIcon fontSize="inherit" />
                  </IconButton>
                </Box>
              )}
            </Card>
              <input
                type="file"
                accept="image/*"
                hidden
                ref={fileInputRef}
                onChange={handleImageChange}
              />
            </Box>
          </Grid>
        </Grid>
        <Grid container spacing={2} sx={{ mt: 1, mb: 2 }}>
          <Grid item xs={12} sm={5} sx={{ ml: 2 }}>
            <Typography sx={{ fontSize: "13px", fontWeight: "bold" }}>
              Instructor Company <span style={{ color: "red" }}>*</span>
            </Typography>
            <TextField
              size="small"
              fullWidth
              placeholder="Type your instructor company"
              sx={{ mt: 1, mb: 1 }}
              value={instructorCompany}
              onChange={(e) => setInstructorCompany(e.target.value)}
              error={!!errors.instructorCompany}
              helperText={errors.instructorCompany}
            />
          </Grid>
          <Grid item xs={12} sm={5}>
            <Typography sx={{ fontSize: "13px", fontWeight: "bold" }}>
              Topics <span style={{ color: "red" }}>*</span>
            </Typography>
            <TextField
              size="small"
              fullWidth
              placeholder="Type your topics"
              sx={{ mt: 1, mb: 1 }}
              value={topics}
              onChange={(e) => setTopics(e.target.value)}
              error={!!errors.topics}
              helperText={errors.topics}
            />
          </Grid>
        </Grid>
        <Box display="flex" alignItems="center" mb={2}>
          <VideocamOutlinedIcon />
          <Typography sx={{ fontSize: "16px", fontWeight: "bold", ml: 1 }}>
            Webinar Details
          </Typography>
        </Box>
        <Box sx={{ ml: 2 }}>
          <Typography sx={{ fontSize: "13px", fontWeight: "bold" }}>
            Webinar Title<span style={{ color: "red" }}>*</span>
          </Typography>
          <TextField
            fullWidth
            size="small"
            placeholder="Type your webinar title"
            sx={{ mt: 1 }}
            value={webinarTitle}
            onChange={(e) => setWebinarTitle(e.target.value)}
            error={!!errors.webinarTitle}
            helperText={errors.webinarTitle}
          />
        </Box>
        <Grid container spacing={2} sx={{ mt: 1, mb:2 }}>
          <Grid item xs={12} md={3.5} sx={{ ml: 2 }}>
            <Typography sx={{ fontSize: "13px", fontWeight: "bold" }}>
              Start Date<span style={{ color: "red" }}>*</span>
            </Typography>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DatePicker
                size="small"
                placeholder="Type start date"
                value={value}
                onChange={(newValue) => setValue(newValue)}
                renderInput={(params) => (
                  <TextField
                    size="small"
                    fullWidth
                    sx={{ mt: 1, mb: 1 }}
                    {...params}
                    error={!!errors.startDate}
                    helperText={errors.startDate}
                  />
                )}
              />
            </LocalizationProvider>
          </Grid>
          <Grid item xs={12} md={3.5}>
            <Typography sx={{ fontSize: "13px", fontWeight: "bold" }}>
              Start Time<span style={{ color: "red" }}>*</span>
            </Typography>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <TimePicker
                placeholder="Type start time"
                size="small"
                value={selectedTime}
                onChange={(newTime) => setSelectedTime(newTime)}
                renderInput={(params) => (
                  <TextField
                    size="small"
                    fullWidth
                    sx={{ mt: 1, mb: 1 }}
                    {...params}
                    error={!!errors.startTime}
                    helperText={errors.startTime}
                  />
                )}
              />
            </LocalizationProvider>
          </Grid>
          <Grid item xs={12} md={3.5}>
            <Typography sx={{ fontSize: "13px", fontWeight: "bold" }}>
              End Time<span style={{ color: "red" }}>*</span>
            </Typography>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <TimePicker
                placeholder="Type end time"
                value={endTime}
                size="small"
                onChange={(newTime) => setEndTime(newTime)}
                renderInput={(params) => (
                  <TextField
                    size="small"
                    fullWidth
                    sx={{ mt: 1, mb: 1 }}
                    {...params}
                    error={!!errors.endTime}
                    helperText={errors.endTime}
                  />
                )}
              />
            </LocalizationProvider>
          </Grid>
        </Grid>
      </DialogContent>
      <Box sx={{ m: 2 }}>
        <Button
          sx={{ mr: 2, backgroundColor: "#0e51f1" }}
          size="small"
          autoFocus
          variant="contained"
          onClick={handleCreateOrUpdateWebinar}
        >
          {isEditing ? "Update Webinar" : "Create Webinar"}
        </Button>

        <Button
          sx={{ color: "#0e51f1", fontWeight: "bold" }}
          size="small"
          autoFocus
          onClick={() => {
            resetForm();
            onClose();
          }}
        >
          Cancel
        </Button>
      </Box>
    </Dialog>
  );
}
