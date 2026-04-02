
import { connectDB } from '@/lib/db';
import { response } from '@/lib/response';
import Question from '@/models/Question';
import type { NextRequest } from 'next/server';

// =============  get single question================
export async function GET(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {

    try {
        const { id } = await params
        await connectDB()

        const question = await Question.findById(id)

        if (!question) {
            return response(false, 404, "Question not found")

        }

        return response(true, 200, "question fetch", question)

    }
    catch (error) {

        return response(false, 500, "Server error")

    }
}


// =============  update  question ================
export async function PUT(
    req: NextRequest,
      { params }: { params: Promise<{ id: string }> }
) {
    try {
        await connectDB()
        const { id } = await params

        const body = await req.json()

        const question = await Question.findByIdAndUpdate(
            id,
            body,
            { new: true }
        )

        if (!question) {
            return response(false, 404, "Question not found")
        }

        return response(true, 200, "Question updated", question)

    } catch (error) {

        return response(false, 500, "Failed to update question")

    }
}

// =============  Delete  question ================

export async function DELETE(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        await connectDB()
        const { id } = await params

        const question = await Question.findByIdAndDelete(id)

        if (!question) {
            return response(false, 404, "Question not found")
        }

        return response(true, 200, "Question deleted")

    } catch (error) {

        return response(false, 500, "Delete failed")

    }
}