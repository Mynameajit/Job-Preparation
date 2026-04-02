import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow
} from "@/components/ui/table"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { CheckCircle } from "lucide-react"
import Link from "next/link"
import { PaginationBtn } from "@/components/common/paginationBtn"
import { useAppSelector } from "@/hooks/useRedux"


export default function ProblemsTable() {

    const { questions } = useAppSelector((state) => state.question)

    if (!questions) {
        return <h1 className="text-3xl ">NO Problem </h1>
    }


    return (
        <div>

            <div className="rounded-xl border ">

                <Table>

                    <TableHeader>

                        <TableRow>

                            <TableHead>#</TableHead>
                            <TableHead>Title</TableHead>
                            <TableHead>Difficulty</TableHead>
                            <TableHead>Category</TableHead>
                            <TableHead>Acceptance</TableHead>
                            <TableHead>Status</TableHead>
                            {/* <TableHead>Companies</TableHead> */}
                            <TableHead>Action</TableHead>

                        </TableRow>

                    </TableHeader>

                    <TableBody>

                        {questions.map((p, i) => (

                            <TableRow key={i}>

                                <TableCell>
                                    {i + 1}
                                </TableCell>


                                <TableCell className="font-medium">
                                    {p.title}
                                </TableCell>

                                <TableCell>

                                    <Badge
                                        variant={
                                            p.difficulty === "easy"
                                                ? "default"
                                                : p.difficulty === "medium"
                                                    ? "secondary"
                                                    : "destructive"
                                        }
                                    >
                                        {p.difficulty}
                                    </Badge>

                                </TableCell>

                                <TableCell>{p.category}</TableCell>

                                <TableCell>{p.acceptance}</TableCell>

                                <TableCell>
                                    <CheckCircle className="text-green-500" size={18} />
                                </TableCell>
                                {/* <TableCell className="space-x-2">

                                    {p.companies.map((c, i) => (
                                        <Badge key={i} variant="outline">
                                            {c}
                                        </Badge>
                                    ))}

                                </TableCell> */}

                                <TableCell >

                                    <Link
                                        href={`/dashboard/practice/${p._id}`} className="px-2 py-1.5 rounded-md text-white bg-violet-700" >
                                        Solve
                                    </Link>

                                </TableCell>

                            </TableRow>

                        ))}

                    </TableBody>

                </Table>

            </div>

        </div>

    )
}