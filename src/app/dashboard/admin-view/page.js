"use client";

import React from "react";
import axios from "axios";
import toast from "react-hot-toast";
import AdminLayout from "@/components/admin-view/layout";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const initialFormData = {
  position: "",
  label: "",
  placeholder: "",
  fieldType: "",
};

export default function AdminDashboard() {
  const [formData, setFormData] = React.useState(initialFormData);
  const [openCreateFormDialog, setOpenCreateFormDialog] = React.useState(false);
  const [formList, setFormList] = React.useState([]);
  const [isEditing, setIsEditing] = React.useState(false);
  const [usersList, setUsersList] = React.useState([]);

  // Fetch all forms
  const fetchFormList = async () => {
    try {
      const response = await axios.get("/api/forms");

      // Sort forms by position in ascending order
      const sortedForms = response.data.forms.sort(
        (a, b) => a.position - b.position
      );

      setFormList(sortedForms);
    } catch (error) {
      console.error("Error fetching form list", error);
      toast.error("Failed to fetch forms");
    }
  };

  const fetchUsersList = async () => {
    try {
      const response = await axios.get("/api/userForms");
      setUsersList(response.data.userforms);
    } catch (error) {
      console.error("Error fetching users list", error);
      toast.error("Failed to fetch user");
    }
  };

  // Create a new form
  const createForm = async (formData) => {
    try {
      const response = await axios.post("/api/forms", formData);
      toast.success("Form created successfully");
      return response.data.form;
    } catch (error) {
      console.error("Error creating form", error);
      toast.error("Failed to create form");
      throw error;
    }
  };

  // Update an existing form
  const updateForm = async (id, updateData) => {
    try {
      const response = await axios.patch("/api/forms", { id, ...updateData });
      toast.success("Form updated successfully");
      return response.data.form;
    } catch (error) {
      console.error("Error updating form", error);
      toast.error("Failed to update form");
      throw error;
    }
  };

  // Delete a form
  const deleteForm = async (id) => {
    try {
      await axios.delete("/api/forms", { data: { id } });
      toast.success("Form deleted successfully");
    } catch (error) {
      console.error("Error deleting form", error);
      toast.error("Failed to delete form");
      throw error;
    }
  };

  // Fetch forms on component mount
  React.useEffect(() => {
    fetchFormList();
    fetchUsersList();
  }, []);

  // Handle form submission
  const onSubmit = async (e) => {
    e.preventDefault();

    // Validate required fields
    if (
      !formData.position ||
      !formData.label ||
      !formData.placeholder ||
      !formData.fieldType
    ) {
      toast.error("All fields are required");
      return;
    }

    try {
      if (isEditing) {
        if (!formData._id) {
          toast.error("Form ID is missing.");
          return;
        }
        await updateForm(formData._id, formData);
      } else {
        await createForm(formData);
      }

      // Refresh the form list and reset the form
      fetchFormList();
      setOpenCreateFormDialog(false);
      setFormData(initialFormData);
      setIsEditing(false);
    } catch (error) {
      console.error("Error submitting form", error);
      toast.error("Error submitting form");
    }
  };

  // Handle editing a form
  const handleEditForm = (form) => {
    setFormData(form);
    setIsEditing(true);
    setOpenCreateFormDialog(true);
  };

  // Handle deleting a form
  const handleDeleteForm = async (formId) => {
    try {
      await deleteForm(formId);
      fetchFormList();
    } catch (error) {
      console.error("Error deleting form", error);
    }
  };

  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  // Handle select changes
  const handleSelectChange = (value) => {
    setFormData((prevData) => ({
      ...prevData,
      fieldType: value,
    }));
  };

  return (
    <AdminLayout>
      <div className="mb-5 w-full flex justify-end">
        <Button
          onClick={() => setOpenCreateFormDialog(true)}
          className="w-full sm:w-auto"
        >
          Create New Form
        </Button>
      </div>

      {/* Display list of forms */}
      <div className="space-y-4">
        {formList.map((form) => (
          <div
            key={form._id}
            className="p-4 border rounded flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4"
          >
            <div className="flex-1">
              <p>Position: {form.position}</p>
              <p>Label: {form.label}</p>
              <p>Placeholder: {form.placeholder}</p>
              <p>Field Type: {form.fieldType}</p>
            </div>
            <div className="flex flex-col sm:flex-row gap-2">
              <Button
                onClick={() => handleEditForm(form)}
                className="w-full sm:w-auto"
              >
                Edit
              </Button>
              <Button
                variant="destructive"
                onClick={() => handleDeleteForm(form._id)}
                className="w-full sm:w-auto"
              >
                Delete
              </Button>
            </div>
          </div>
        ))}
      </div>

      {/* Display list of users */}
      <div className="mt-5">
        <h1 className="text-xl font-bold mb-4">USERS</h1>
        {usersList.map((user) => (
          <div
            key={user._id}
            className="p-4 border rounded flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4"
          >
            <div className="break-all">{JSON.stringify(user)}</div>
          </div>
        ))}
      </div>

      {/* Form creation/edit sheet */}
      <Sheet
        open={openCreateFormDialog}
        onOpenChange={() => {
          setOpenCreateFormDialog(false);
          setFormData(initialFormData);
          setIsEditing(false);
        }}
      >
        <SheetContent side="right" className="overflow-auto">
          <SheetHeader>
            <SheetTitle>
              {isEditing ? "Edit Form" : "Create New Form"}
            </SheetTitle>
          </SheetHeader>
          <div className="flex flex-col gap-4 mt-5">
            <Input
              type="text"
              name="position"
              placeholder="Enter the Position eg: 1, 2, 3"
              className="border p-2 w-full"
              value={formData.position}
              onChange={handleInputChange}
            />
            <Input
              type="text"
              name="label"
              placeholder="Enter the Label"
              className="border p-2 w-full"
              value={formData.label}
              onChange={handleInputChange}
            />
            <Input
              type="text"
              name="placeholder"
              placeholder="Enter the Placeholder"
              className="border p-2 w-full"
              value={formData.placeholder}
              onChange={handleInputChange}
            />
            <Select
              onValueChange={handleSelectChange}
              value={formData.fieldType}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select Form Field" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="input">Input Field</SelectItem>
                <SelectItem value="select">Select Box</SelectItem>
                <SelectItem value="textarea">Text Area</SelectItem>
              </SelectContent>
            </Select>
            <Button onClick={onSubmit} className="w-full">
              {isEditing ? "Update Field" : "Add Field"}
            </Button>
          </div>
        </SheetContent>
      </Sheet>
    </AdminLayout>
  );
}