import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  TextField,
  Button,
  Divider,
  Grid,
  Card,
  Avatar,
  InputAdornment,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import WebinarDialog from "./WebinarDialog";
import data from "../data.json";

import { useTheme } from "@mui/material/styles";
import OutlinedInput from "@mui/material/OutlinedInput";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};

function getStyles(name, personName, theme) {
  return {
    fontWeight:
      personName.indexOf(name) === -1
        ? theme.typography.fontWeightRegular
        : theme.typography.fontWeightMedium,
  };
}
export default function WebinarList() {
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredData, setFilteredData] = useState(data);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedSkills, setSelectedSkills] = useState([]);

  const [selectedWebinar, setSelectedWebinar] = useState(null);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    // Filter data whenever searchTerm or selectedSkills changes
    const results = data.filter((item) => {
      const matchesSearchTerm =
        item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.company.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesSelectedSkills =
        selectedSkills.length === 0 ||
        selectedSkills.every((skill) => item.skills.includes(skill));

      return matchesSearchTerm && matchesSelectedSkills;
    });

    setFilteredData(results);
  }, [searchTerm, selectedSkills]);

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleClickOpenDialog = () => {
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setSelectedWebinar(null);
    setIsEditing(false);
    setOpenDialog(false);
  };

  const handleEditWebinar = (webinar) => {
    setSelectedWebinar(webinar);
    setIsEditing(true);
    setOpenDialog(true);
  };


const handleUpdateWebinar = (updatedWebinar) => {
    setFilteredData(filteredData.map(webinar => 
      webinar.id === updatedWebinar.id ? updatedWebinar : webinar
    ));
    handleCloseDialog();
  };

  const handleDeleteWebinar = (id) => {
    // Filter out the webinar with the given id
    const updatedWebinars = filteredData.filter((webinar) => webinar.id !== id);
    setFilteredData(updatedWebinars);
  };

  const theme = useTheme();

  const handleChange = (event) => {
    const {
      target: { value },
    } = event;
    setSelectedSkills(typeof value === "string" ? value.split(",") : value);
  };

  const allSkills = [
    ...new Set(data.flatMap((item) => item.skills.split(", "))),
  ];

  return (
    <Box sx={{ m: 2 }}>
      <Box display="flex" justifyContent="space-between" sx={{ mb: 2 }}>
        <Typography style={{ fontSize: "18px", fontWeight: "bold" }}>
          Webinar
        </Typography>
        <Button
          variant="contained"
          onClick={handleClickOpenDialog}
          style={{ backgroundColor: "#0e51f1", color: "#fff" }}
        >
          Add Webinar
        </Button>
      </Box>
      <Divider />
      <Box
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginBottom: "24px",
          marginTop: "16px",
        }}
      >
        <TextField
          size="small"
          variant="outlined"
          placeholder="Search for webinar..."
          style={{ borderRadius: "20px", width: "30%" }}
          value={searchTerm}
          onChange={handleSearchChange}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
        />

        <div>
          <FormControl sx={{ m: 1, width: 300 }}>
            <InputLabel
              id="skills-select-label"
            //   fix me later if required
            //   shrink
            //   sx={{
            //     top: "25%",
            //     transform: "translateX(-50%)",
            //     textAlign: "center",
            //     "&.MuiInputLabel-shrink": {
            //       left: "10%",
            //       transform: "translateX(-50%)",
            //     },
            //   }}
            >
              Topic
            </InputLabel>
            <Select
              labelId="skills-select-label"
              id="skills-select"
              multiple
              size="small"
              value={selectedSkills}
              placeholder="Skills"
              onChange={handleChange}
              input={<OutlinedInput placeholder="Skills" />}
              MenuProps={MenuProps}
            >
              {allSkills.map((skill) => (
                <MenuItem
                  key={skill}
                  value={skill}
                  style={getStyles(skill, selectedSkills, theme)}
                >
                  {skill}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </div>
      </Box>
      <Grid container spacing={2}>
        {filteredData.map((item, index) => (
          <Grid item xs={12} sm={6} md={4} lg={4} key={index}>
            <Card
              variant="outlined"
              sx={{ borderRadius: "20px", height: "100%" }}
            >
              <Box>
                <Card
                  variant="outlined"
                  style={{
                    height: "140px",
                    display: "flex",
                    justifyContent: "space-around",
                    alignItems: "center",
                    margin: "20px",
                    borderRadius: "20px",
                    backgroundColor: "#751ee3",
                  }}
                >
                  <Box>
                    <Typography
                      color="#fff"
                      style={{ fontSize: "18px", fontWeight: "bold" }}
                    >
                      {item.name}
                    </Typography>
                    <Typography
                      variant="h6"
                      style={{
                        fontSize: "14px",
                        color: "#fff",
                        fontWeight: "bold",
                      }}
                    >
                      {item.title}
                    </Typography>
                    <Typography
                      variant="h6"
                      style={{
                        fontSize: "14px",
                        color: "#fff",
                        fontWeight: "bold",
                      }}
                    >
                      {item.company}
                    </Typography>
                  </Box>
                  <Box>
                    <Avatar
                      sx={{ height: "76px", width: "76px" }}
                      variant="rounded"
                      src={item.avatar}
                    />
                  </Box>
                </Card>
              </Box>
              <Box style={{ margin: "20px" }}>
                <Typography
                  style={{
                    fontSize: "14px",
                    fontWeight: "bold",
                    color: "#751ee3",
                  }}
                >
                  {item.position}
                </Typography>
                <Typography
                  style={{
                    fontSize: "18px",
                    fontWeight: "bold",
                    lineHeight: "28px",
                  }}
                >
                  {item.skills}
                </Typography>
                <Typography style={{ fontSize: "14px" }}>
                  {item.schedule}
                </Typography>
                <Box sx={{ mt: 2 }}>
                  <Button
                    onClick={() => handleDeleteWebinar(item.id)}
                    color="error"
                    variant="outlined"

                    style={{ borderRadius: "24px", marginRight: "16px", fontWeight:"bold" }}
                  >
                    Delete
                  </Button>
                  <Button
                  size="small"
                  color="primary"
                
                  sx={{  fontWeight:"bold"}}
                  onClick={() => handleEditWebinar(item)}
                >

                  Edit
                </Button>
                </Box>
              </Box>
            </Card>
          </Grid>
        ))}
      </Grid>
      <WebinarDialog
      open={openDialog}
      onClose={handleCloseDialog}
      onAddWebinar={(newWebinar) => {
        setFilteredData([...filteredData, newWebinar]);
        handleCloseDialog();
      }}
      webinar={selectedWebinar}
      isEditing={isEditing}
      onUpdateWebinar={handleUpdateWebinar}
    />
    
    </Box>
  );
}
