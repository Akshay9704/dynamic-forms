"use client";
import { Button } from "@/components/ui/button";
import React, { useState, useEffect } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import UserLayout from "@/components/user-view/layout";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const UserDashboard = () => {
  const [formList, setFormList] = useState([]);
  const [formData, setFormData] = useState({});

  console.log("Submitting data:", formData);
  console.log("Form list:", formList);

  const fetchFormList = async () => {
    try {
      const response = await axios.get("/api/forms");

      const sortedForms = response.data.forms.sort(
        (a, b) => a.position - b.position
      );

      setFormList(sortedForms);

      // Initialize form data with transformed keys
      const initialFormData = {};
      sortedForms.forEach((form) => {
        const key = form.label.replace(/\s+/g, "_").toLowerCase();
        initialFormData[key] = "";
      });
      setFormData(initialFormData);
    } catch (error) {
      console.error("Error fetching form list", error);
      toast.error("Failed to fetch forms");
    }
  };

  // Handle input changes
  const handleInputChange = (label, value) => {
    const key = label.replace(/\s+/g, "_").toLowerCase();
    setFormData((prevData) => ({
      ...prevData,
      [key]: value,
    }));
  };

  // Handle form submission
  const handleSubmit = async () => {
    try {
      const formattedData = {};
      Object.entries(formData).forEach(([key, value]) => {
        formattedData[key] = value;
      });

      const response = await axios.post("/api/userForms", { users: formattedData });
      toast.success("Form submitted successfully");
      console.log("Form submitted successfully", response.data.userForm);
      setFormData({});
    } catch (error) {
      console.error("Error submitting form", error);
      toast.error("Failed to submit form");
    }
  };

  useEffect(() => {
    fetchFormList();
  }, []);

  return (
    <UserLayout>
      <div>
        <h1 className="text-center text-3xl font-bold mb-5">Fill the Form</h1>
        {formList.map((form) => {
          const key = form.label.replace(/\s+/g, "_").toLowerCase();
          return (
            <div key={form._id} className="flex flex-col items-center my-4">
              {form.fieldType === "input" && (
                <Input
                  placeholder={form.placeholder}
                  type="text"
                  value={formData[key] || ""}
                  onChange={(e) => handleInputChange(form.label, e.target.value)}
                />
              )}
              {form.fieldType === "textarea" && (
                <Textarea
                  placeholder={form.placeholder}
                  value={formData[key] || ""}
                  onChange={(e) => handleInputChange(form.label, e.target.value)}
                />
              )}
              {form.fieldType === "select" && (
                <Select
                  value={formData[key] || ""}
                  onValueChange={(value) => handleInputChange(form.label, value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder={form.placeholder} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="male">Male</SelectItem>
                    <SelectItem value="female">Female</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              )}
            </div>
          );
        })}
      </div>
      <div className="flex justify-center mt-5">
        <Button onClick={handleSubmit}>Submit Form</Button>
      </div>
    </UserLayout>
  );
};

export default UserDashboard;
