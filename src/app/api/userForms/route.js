import { NextResponse } from "next/server";
import UserForm from "@/models/userFormModel";
import { connect } from "@/dbConfig/dbConfig";

connect();

// GET: Fetch all forms
export async function GET() {
  try {
    const userforms = await UserForm.find({});
    return NextResponse.json({ userforms }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch user forms" },
      { status: 500 }
    );
  }
}

// POST: Create a new user form
export async function POST(request) {
  try {
    const body = await request.json(); // Ensure request body is parsed
    const { users } = body;

    if (!users || typeof users !== "object") {
      return NextResponse.json(
        { error: "User data is required and must be an object" },
        { status: 400 }
      );
    }

    const newUserForm = new UserForm({ users });
    await newUserForm.save();

    return NextResponse.json(
      { message: "UserForm created successfully", userForm: newUserForm },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating user form:", error);
    return NextResponse.json(
      { error: "Failed to create user form" },
      { status: 500 }
    );
  }
}
