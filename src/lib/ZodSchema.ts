import { z } from "zod";

export const loginSchema = z.object({
  email: z
    .string()
    .email("Invalid email address"),

  password: z
    .string()
    .min(6, "Password must be at least 6 characters")

});




export const registerSchema = z.object({
  name: z
    .string()
    .min(2, "Name must be at least 2 characters"),

  email: z
    .string()
    .email("Enter valid email"),

  password: z
    .string()
    .min(6, "Password must be at least 6 characters")
    .regex(/[A-Z]/, "Must contain one uppercase letter")
    .regex(/[0-9]/, "Must contain one number")
    .regex(/[^A-Za-z0-9]/, "Must contain one special character")
})





export const questionSchema = z
  .object({
    title: z.string().min(1, "Title is required"),

    slug: z.string().min(1, "Slug is required"),

    description: z.string().min(1, "Description is required"),

    difficulty: z.enum(["easy", "medium", "hard"]),

    category: z.string().min(1, "Category is required"),

    type: z.enum(["practice", "test"]),

    // ✅ Examples (UI ke liye)
    examples: z
      .array(
        z.object({
          input: z.string().min(1),
          output: z.string().min(1),
          explanation: z.string().optional(),
        })
      )
      .optional(),

    // ✅ Coding
    testCases: z
      .array(
        z.object({
          input: z.string().min(1),
          output: z.string().min(1),
        })
      )
      .optional(),

    starterCode: z
      .object({
        javascript: z.string().optional(),
        python: z.string().optional(),
        java: z.string().optional(),
      })
      .optional(),

    // ✅ MCQ
    options: z.array(z.string().min(1)).optional(),

    correctAnswer: z.string().optional(),
  })
  .superRefine((data, ctx) => {
    // 🔥 Practice validation
    if (data.type === "practice") {
      if (!data.testCases || data.testCases.length === 0) {
        ctx.addIssue({
          path: ["testCases"],
          message: "Test cases required for practice question",
          code: z.ZodIssueCode.custom,
        });
      }
    }

    // 🔥 MCQ validation
    if (data.type === "test") {
      if (!data.options || data.options.length < 2) {
        ctx.addIssue({
          path: ["options"],
          message: "Minimum 2 options required",
          code: z.ZodIssueCode.custom,
        });
      }

      if (!data.correctAnswer) {
        ctx.addIssue({
          path: ["correctAnswer"],
          message: "Correct answer required",
          code: z.ZodIssueCode.custom,
        });
      }

      if (
        data.options &&
        data.correctAnswer &&
        !data.options.includes(data.correctAnswer)
      ) {
        ctx.addIssue({
          path: ["correctAnswer"],
          message: "Correct answer must be inside options",
          code: z.ZodIssueCode.custom,
        });
      }
    }
  });






export const testSchema = z.object({
  title: z
    .string()
    .min(3, "Title must be at least 3 characters")
    .max(100, "Title too long"),

  description: z
    .string()
    .max(500, "Description too long")
    .optional(),

  difficulty: z
    .enum(["Easy", "Medium", "Hard"])
    .optional(),

  tag: z.string().optional(),

  type: z
    .enum(["practice", "mock"])
    .optional(),

  questions: z
    .array(z.string().min(1))
    .min(1, "At least one question is required"),

  duration: z
    .number("Duration is required",)
    .min(1, "Duration must be at least 1 minute"),

  totalMarks: z.number().optional(),

  negativeMarks: z.number().optional(),

  lastDate: z
    .string()
    .optional()
    .refine(
      (val) => !val || !isNaN(Date.parse(val)),
      "Invalid date format"
    ),
});






export const resultSchema = z.object({
  testId: z.string().regex(/^[0-9a-fA-F]{24}$/),

  userId: z.string().regex(/^[0-9a-fA-F]{24}$/),

  // 🔥 FIX HERE
  answers: z.record(z.string(), z.string()),

  timeTaken: z.number().min(1),
});