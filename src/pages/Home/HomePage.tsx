import {Card, CardContent, CardDescription, CardHeader, CardTitle} from "@/components/ui/card.tsx";
import {SecretsBanner} from "@/components/app/SecretsBanner/SecretsBanner.tsx";

import {useNavigate} from "react-router-dom";

const recommendations = [
    {
        name: "Top-5 video pipeline",
        description: "Automatically generate a compilation of the top 5 moments from your long-form video content.",
        url: "/pipelines/top-5"
    },
    {
        name: "Long to shorts tool",
        description: "Convert your long-form videos into engaging short-form content optimized for platforms like TikTok and Instagram Reels.",
        url: "/tools/long-to-shorts"
    }
]


function HomePage() {
    const navigate = useNavigate();

    return (
        <main className="flex flex-col items-center justify-center h-screen">
            <div>
                <SecretsBanner/>
            </div>
            <div className="container mx-auto px-4 py-8">
                <header className="mb-8">
                    <h1 className="text-3xl font-bold text-center">Persona AI Studio</h1>
                    <p className="text-xl text-center text-muted-foreground mt-2">Choose a tool or pipeline to get
                        started</p>
                </header>

                <section className="lg:px-20">
                    <h2 className="text-2xl font-semibold mb-4">Recommended Tools & Pipelines</h2>
                    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-2">
                        {recommendations.map((item, index) => (
                            <Card
                                key={index}
                                className="hover:shadow-lg transition-shadow cursor-pointer bg-secondary"
                                onClick={() => navigate(item.url)}
                            >
                                <CardHeader>
                                    <CardTitle>{item.name}</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <CardDescription>{item.description}</CardDescription>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </section>
            </div>
        </main>
    );
}

export default HomePage;
