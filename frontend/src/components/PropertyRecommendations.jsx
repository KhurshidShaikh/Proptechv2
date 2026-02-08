import React, { useState, useEffect } from "react";
import { Sparkles, MapPin, Bed, Home, Loader2, RefreshCw } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { getRecommendations } from "@/api/mlApi";

export default function PropertyRecommendations() {
    const [recommendations, setRecommendations] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [searchInput, setSearchInput] = useState("");
    const [searchedRegions, setSearchedRegions] = useState([]);

    const handleAddRegion = (e) => {
        e.preventDefault();
        if (searchInput.trim() && !searchedRegions.includes(searchInput.trim())) {
            setSearchedRegions([...searchedRegions, searchInput.trim()]);
            setSearchInput("");
        }
    };

    const handleRemoveRegion = (region) => {
        setSearchedRegions(searchedRegions.filter((r) => r !== region));
    };

    const handleGetRecommendations = async () => {
        if (searchedRegions.length === 0) return;

        setLoading(true);
        setError(null);

        try {
            const result = await getRecommendations(searchedRegions);
            setRecommendations(result.recommendations || []);
        } catch (err) {
            setError(err.response?.data?.error || "Unable to get recommendations. Try different regions.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Card className="bg-gradient-to-br from-indigo-50 to-purple-50 border-indigo-200 mt-8">
            <CardHeader>
                <CardTitle className="flex items-center text-xl">
                    <Sparkles className="mr-2 h-6 w-6 text-indigo-600" />
                    AI Property Recommendations
                </CardTitle>
                <p className="text-sm text-gray-600">
                    Enter regions you're interested in, and our AI will suggest matching properties
                </p>
            </CardHeader>
            <CardContent className="space-y-4">
                {/* Region Input */}
                <form onSubmit={handleAddRegion} className="flex gap-2">
                    <Input
                        type="text"
                        placeholder="Enter a region (e.g., Andheri, Bandra)"
                        value={searchInput}
                        onChange={(e) => setSearchInput(e.target.value)}
                        className="flex-grow"
                    />
                    <Button type="submit" variant="outline">
                        Add
                    </Button>
                </form>

                {/* Selected Regions */}
                {searchedRegions.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                        {searchedRegions.map((region) => (
                            <Badge
                                key={region}
                                variant="secondary"
                                className="cursor-pointer hover:bg-red-100"
                                onClick={() => handleRemoveRegion(region)}
                            >
                                {region} ✕
                            </Badge>
                        ))}
                    </div>
                )}

                {/* Get Recommendations Button */}
                <Button
                    onClick={handleGetRecommendations}
                    disabled={loading || searchedRegions.length === 0}
                    className="w-full bg-indigo-600 hover:bg-indigo-700"
                >
                    {loading ? (
                        <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Finding Properties...
                        </>
                    ) : (
                        <>
                            <Sparkles className="mr-2 h-4 w-4" />
                            Get AI Recommendations
                        </>
                    )}
                </Button>

                {/* Error Message */}
                {error && (
                    <p className="text-sm text-red-600 text-center">{error}</p>
                )}

                {/* Recommendations Grid */}
                {recommendations.length > 0 && (
                    <div className="space-y-3 mt-4">
                        <div className="flex justify-between items-center">
                            <h3 className="font-semibold text-lg">Recommended Properties</h3>
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={handleGetRecommendations}
                            >
                                <RefreshCw className="h-4 w-4 mr-1" />
                                Refresh
                            </Button>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                            {recommendations.slice(0, 6).map((property, index) => (
                                <Card key={index} className="bg-white">
                                    <CardContent className="p-4">
                                        <div className="flex items-center mb-2">
                                            <MapPin className="h-4 w-4 mr-1 text-gray-500" />
                                            <span className="font-medium text-sm">
                                                {property.locality}, {property.region}
                                            </span>
                                        </div>

                                        <div className="flex flex-wrap gap-2 mb-2">
                                            <Badge variant="outline" className="text-xs">
                                                <Home className="h-3 w-3 mr-1" />
                                                {property.type}
                                            </Badge>
                                            <Badge variant="outline" className="text-xs">
                                                <Bed className="h-3 w-3 mr-1" />
                                                {property.bhk} BHK
                                            </Badge>
                                        </div>

                                        <div className="text-xs text-gray-600 space-y-1">
                                            <p>Area: {property.area} sqft</p>
                                            <p>Status: {property.status}</p>
                                            <p>Age: {property.age}</p>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    </div>
                )}
            </CardContent>
        </Card>
    );
}
