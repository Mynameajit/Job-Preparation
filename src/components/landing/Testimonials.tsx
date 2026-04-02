"use client"

import Image from "next/image"
import { Card, CardContent } from "@/components/ui/card"
import { Star } from "lucide-react"
import { testimonials } from "@/data/testimonials"
import { motion } from "framer-motion"

export default function Testimonials() {
    return (

        <section className="container mx-auto px-6 py-20">

            {/* Heading */}

            <motion.div
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                viewport={{ once: true }} className="text-center mb-16">

                <h2 className="text-4xl font-bold">
                    Student Success Stories
                </h2>

                <p className="text-muted-foreground mt-4 text-lg">
                    Hear from students who achieved their dream placements
                </p>

            </motion.div>

            {/* Cards */}

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">

                {testimonials.map((item, index) => (
                    <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 40 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{
                            duration: 0.5,
                            delay: index * 0.15
                        }}
                        viewport={{ once: true }}
                        whileHover={{
                            y: -8
                        }}
                    >
                        <Card key={index} className="hover:shadow-lg transition">

                            <CardContent className="p-6">

                                {/* Stars */}

                                <div className="flex mb-4">

                                    {[...Array(5)].map((_, i) => (

                                        <Star
                                            key={i}
                                            className="h-4 w-4 fill-yellow-400 text-yellow-400"
                                        />

                                    ))}

                                </div>

                                {/* Text */}

                                <p className="text-sm text-muted-foreground mb-6">
                                    "{item.content}"
                                </p>

                                {/* User */}

                                <div className="flex items-center gap-3">

                                    <Image
                                        src={item.image || "/avatar.png"}
                                        alt={item.name}
                                        width={40}
                                        height={40}
                                        className="rounded-full object-contain"
                                    />
                                    <div>

                                        <p className="font-semibold">
                                            {item.name}
                                        </p>

                                        <p className="text-sm text-muted-foreground">
                                            {item.role}
                                        </p>

                                    </div>

                                </div>

                            </CardContent>

                        </Card>
                    </motion.div>
                ))}

            </div>

        </section>

    )
}