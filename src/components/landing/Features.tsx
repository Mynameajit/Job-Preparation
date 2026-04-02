"use client"

import { Card, CardContent } from "@/components/ui/card"
import { features } from "@/data/features"
import { motion } from "framer-motion"


export default function Features() {
    return (
        <section className="container mx-auto px-6 py-24">

            {/* Heading */}

            <motion.div
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                viewport={{ once: true }}
                className="text-center mb-16">



                <h2 className="text-4xl md:text-5xl font-bold tracking-tight">

                    Everything You Need To

                    <span className="block bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 bg-clip-text text-transparent">

                        Crack Your Dream Job

                    </span>

                </h2>

                <p className="text-muted-foreground mt-6 text-lg max-w-2xl mx-auto">

                    Our platform provides all the tools you need to prepare for coding interviews,
                    mock tests, resume building and placement success.

                </p>

            </motion.div>

            {/* Feature Grid */}

            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">

                {features.map((feature, index) => {

                    const Icon = feature.icon

                    return (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 40 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{
                                duration: 0.5,
                                delay: index * 0.15
                            }}
                            viewport={{ once: true }}
                            whileHover={{ y: -8 }}
                        >
                            <Card
                                key={index}
                                className="
              group
              border
              transition-all
              duration-300
              hover:shadow-xl
              hover:-translate-y-2
              "
                            >

                                <CardContent className="p-8">

                                    {/* Icon */}

                                    <div className="
                  flex items-center justify-center
                  w-14 h-14
                  rounded-xl
                  bg-gradient-to-r
                  from-indigo-500/10
                  to-purple-500/10
                  mb-6
                  group-hover:scale-110
                  transition
                ">

                                        <Icon className="w-6 h-6 text-indigo-500" />

                                    </div>

                                    {/* Title */}

                                    <h3 className="font-semibold text-xl mb-3">

                                        {feature.title}

                                    </h3>

                                    {/* Description */}

                                    <p className="text-muted-foreground text-sm leading-relaxed">

                                        {feature.description}

                                    </p>

                                </CardContent>

                            </Card>
                        </motion.div>

                    )

                })}

            </div>

        </section>
    )
}