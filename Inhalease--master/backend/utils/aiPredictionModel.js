/**
 * AI Prediction Logic for AQI Risk Assessment
 * Pure Node.js implementation
 */

// Simple ML model for air quality prediction
class AQIPredictionModel {
    constructor() {
        this.historicalData = [];
    }

    /**
     * Predict AQI based on environmental factors
     */
    predictAQI(city, currentAQI, factors = {}) {
        const {
            trafficDensity = Math.random() * 1,
            urbanTopology = 0.7 + Math.random() * 0.3,
            windSpeed = Math.random() * 15,
            temperature = 15 + Math.random() * 15
        } = factors;

        // Base AQI risk calculation
        let baseAQIRisk = currentAQI || (Math.random() * 100 + 30);

        // Biological risk component (max ~30 points)
        let bioRisk = 0;
        bioRisk += Math.random() * 10; // Pollen variation
        bioRisk += Math.random() * 10; // Mold spores
        bioRisk += Math.random() * 10; // Bacteria/viruses

        // Environmental modifier (max ~20 points)
        let envRisk = 0;
        envRisk += trafficDensity * 10;
        envRisk += (urbanTopology - 0.9) * 25;

        // Wind impact (negative = good, positive = bad)
        if (windSpeed < 2) envRisk += 5; // Stagnant air
        else if (windSpeed > 8) envRisk -= 3; // Good dispersion

        // Temperature impact
        if (temperature > 25) envRisk += 5; // Heat increases ozone
        else if (temperature < 0) envRisk += 3; // Cold traps pollution

        // Calculate total score
        const totalScore = Math.min(baseAQIRisk + bioRisk + envRisk, 100);

        // Classify risk level
        let classification = 'Low';
        if (totalScore > 85) classification = 'Critical';
        else if (totalScore > 65) classification = 'High';
        else if (totalScore > 40) classification = 'Moderate';

        // Determine trend
        let trend = 'Stable';
        if (classification === 'Critical' || classification === 'High') {
            trend = Math.random() > 0.5 ? 'Rising' : 'Stable';
        } else {
            trend = Math.random() > 0.5 ? 'Stable' : 'Falling';
        }

        return {
            city,
            predictedAqi: Math.round(totalScore),
            classification,
            trend,
            timestamp: new Date(),
            factors: {
                traffic: trafficDensity,
                urbanization: urbanTopology,
                wind: windSpeed,
                temperature
            }
        };
    }

    /**
     * Generate health recommendations based on AQI
     */
    getHealthRecommendations(aqi) {
        if (aqi <= 50) {
            return {
                level: 'Good',
                color: '#4ade80',
                recommendations: [
                    'Air quality is satisfactory',
                    'Perfect for outdoor activities',
                    'No respiratory concerns'
                ]
            };
        } else if (aqi <= 100) {
            return {
                level: 'Moderate',
                color: '#facc15',
                recommendations: [
                    'Air quality is acceptable',
                    'Sensitive individuals should limit outdoor exertion',
                    'Wear mask if doing heavy exercise'
                ]
            };
        } else if (aqi <= 150) {
            return {
                level: 'Unhealthy for Sensitive Groups',
                color: '#fb923c',
                recommendations: [
                    'Members of sensitive groups may experience health effects',
                    'Children and elderly should limit outdoor activity',
                    'Consider using air purifier indoors'
                ]
            };
        } else {
            return {
                level: 'Unhealthy',
                color: '#ef4444',
                recommendations: [
                    'Everyone may experience health effects',
                    'Avoid outdoor activities',
                    'Use N95 masks if going outside',
                    'Stay indoors with air purifier'
                ]
            };
        }
    }

    /**
     * Generate 7-day forecast
     */
    generateForecast(city, currentAQI) {
        const forecast = [];
        let aqi = currentAQI || 50;

        for (let day = 0; day < 7; day++) {
            // Simulate daily variation
            const variation = (Math.random() - 0.5) * 20; // ±10 variation
            aqi = Math.max(0, Math.min(200, aqi + variation));

            forecast.push({
                day: day + 1,
                aqi: Math.round(aqi),
                date: new Date(Date.now() + day * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
            });
        }

        return forecast;
    }
}

module.exports = new AQIPredictionModel();
