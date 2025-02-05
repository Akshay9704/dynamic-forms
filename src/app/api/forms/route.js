import { NextResponse } from "next/server";
import Form from "@/models/formModel";
import { connect } from "@/dbConfig/dbConfig";

connect();

// GET: Fetch all forms
export async function GET() {
  try {
    const forms = await Form.find({});
    return NextResponse.json({ forms }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch forms" },
      { status: 500 }
    );
  }
}

// POST: Create a new form
export async function POST(request) {
  try {
    const { fieldType, position, label, placeholder } = await request.json();

    // Validate required fields
    if (!fieldType || !position || !label || !placeholder) {
      return NextResponse.json(
        { error: "All fields are required" },
        { status: 400 }
      );
    }

    // Create a new form
    const newForm = new Form({
      fieldType,
      position,
      label,
      placeholder,
    });

    await newForm.save();

    return NextResponse.json(
      { message: "Form created successfully", form: newForm },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to create form" },
      { status: 500 }
    );
  }
}

// PATCH: Update an existing form
export async function PATCH(request) {
  try {
    const { id, ...updateData } = await request.json();

    // Validate ID
    if (!id) {
      return NextResponse.json({ error: "Form ID is required" }, { status: 400 });
    }

    // Update the form
    const updatedForm = await Form.findByIdAndUpdate(id, updateData, {
      new: true,
    });

    if (!updatedForm) {
      return NextResponse.json({ error: "Form not found" }, { status: 404 });
    }

    return NextResponse.json(
      { message: "Form updated successfully", form: updatedForm },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to update form" },
      { status: 500 }
    );
  }
}

// DELETE: Delete a form
export async function DELETE(request) {
  try {
    const { id } = await request.json();

    // Validate ID
    if (!id) {
      return NextResponse.json({ error: "Form ID is required" }, { status: 400 });
    }

    // Delete the form
    const deletedForm = await Form.findByIdAndDelete(id);

    if (!deletedForm) {
      return NextResponse.json({ error: "Form not found" }, { status: 404 });
    }

    return NextResponse.json(
      { message: "Form deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to delete form" },
      { status: 500 }
    );
  }
}