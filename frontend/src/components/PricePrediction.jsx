import React, { useState } from "react";
import { TrendingUp, TrendingDown, Minus, Sparkles, Loader2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { predictPrice } from "@/api/mlApi";

export default function PricePrediction({ property }) {
    const [prediction, setPrediction] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleAnalyzePrice = async () => {
        setLoading(true);
        setError(null);

        try {
            // Convert price to Lakhs (assuming price is in full value)
            const priceValue = parseFloat(String(property.basicInfo.price).replace(/[^0-9.]/g, ''));
            const priceInLakhs = priceValue / 100000;
            const bedroomCount = parseInt(property.basicInfo.bedroom, 10) || 1;

            const result = await predictPrice(
                property.basicInfo.city,
                bedroomCount,
                priceInLakhs
            );
            setPrediction(result);
        } catch (err) {
            setError(err.response?.data?.error || "Unable to analyze price. Region may not be in our dataset.");
        } finally {
            setLoading(false);
        }
    };

    const getVariationIcon = () => {
        if (!prediction) return null;
        const variation = prediction.price_variation;
        if (variation.includes("above")) {
            return <TrendingUp className="h-5 w-5 text-red-500" />;
        } else if (variation.includes("below")) {
            return <TrendingDown className="h-5 w-5 text-green-500" />;
        }
        return <Minus className="h-5 w-5 text-gray-500" />;
    };

    const getVariationColor = () => {
        if (!prediction) return "";
        const variation = prediction.price_variation;
        if (variation.includes("above")) return "text-red-600";
        if (variation.includes("below")) return "text-green-600";
        return "text-gray-600";
    };

    return (
        <Card className="bg-gradient-to-br from-purple-50 to-blue-50 border-purple-200">
            <CardHeader className="pb-2">
                <CardTitle className="flex items-center text-lg">
                    <Sparkles className="mr-2 h-5 w-5 text-purple-600" />
                    AI Price Analysis
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                {!prediction && !error && (
                    <div className="text-center py-2">
                        <p className="text-sm text-gray-600 mb-3">
                            Get AI-powered market price analysis for this property
                        </p>
                        <Button
                            onClick={handleAnalyzePrice}
                            disabled={loading}
                            className="bg-purple-600 hover:bg-purple-700"
                        >
                            {loading ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Analyzing...
                                </>
                            ) : (
                                <>
                                    <Sparkles className="mr-2 h-4 w-4" />
                                    Analyze Price
                                </>
                            )}
                        </Button>
                    </div>
                )}

                {error && (
                    <div className="text-center py-2">
                        <p className="text-sm text-red-600 mb-3">{error}</p>
                        <Button
                            onClick={handleAnalyzePrice}
                            variant="outline"
                            size="sm"
                        >
                            Try Again
                        </Button>
                    </div>
                )}

                {prediction && (
                    <div className="space-y-3">
                        <div className="flex justify-between items-center">
                            <span className="text-sm text-gray-600">Market Rate:</span>
                            <Badge variant="secondary" className="text-sm">
                                {prediction.predicted_price}
                            </Badge>
                        </div>

                        <div className="flex justify-between items-center">
                            <span className="text-sm text-gray-600">Listed Price:</span>
                            <Badge variant="outline" className="text-sm">
                                {prediction.user_price}
                            </Badge>
                        </div>

                        <div className="flex justify-between items-center pt-2 border-t">
                            <span className="text-sm font-medium">Price Assessment:</span>
                            <div className={`flex items-center ${getVariationColor()}`}>
                                {getVariationIcon()}
                                <span className="ml-1 text-sm font-semibold">
                                    {prediction.price_variation}
                                </span>
                            </div>
                        </div>

                        <Button
                            onClick={handleAnalyzePrice}
                            variant="ghost"
                            size="sm"
                            className="w-full mt-2"
                        >
                            Refresh Analysis
                        </Button>
                    </div>
                )}
            </CardContent>
        </Card>
    );
}
