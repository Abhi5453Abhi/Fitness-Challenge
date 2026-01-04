import { NextRequest, NextResponse } from 'next/server'

interface UserRequest {
    userId: string
    name: string
    selectedGoals: string[]
    gender: string
    age: number
    height: number
    weight: number
    targetWeight: number
    weeklyRate: string
    habits: string[]
    activityLevel: string
    barriers: string[]
    pledgeDays: number
}

interface Meal {
    name: string
    calories: number
    protein: number
    carbs: number
    fat: number
    description: string
}

interface AIPlanResponse {
    calories: number
    protein: number
    carbs: number
    fat: number
    message: string
    goalSummary: string
    meals: {
        breakfast: Meal
        lunch: Meal
        dinner: Meal
        snack: Meal
    }
}

export async function POST(request: NextRequest) {
    try {
        const req: UserRequest = await request.json()

        const apiKey = process.env.OPENAI_API_KEY

        // Return mock data if API key is missing
        if (!apiKey) {
            const mockPlan: AIPlanResponse = {
                calories: 2250,
                protein: 180,
                carbs: 200,
                fat: 65,
                message: 'This is a mocked plan because API key is missing.',
                goalSummary: 'Lose Weight & Build Muscle',
                meals: {
                    breakfast: { name: 'Paneer Paratha', calories: 500, protein: 20, carbs: 60, fat: 20, description: '2 parathas with curd' },
                    lunch: { name: 'Rajma Chawal', calories: 700, protein: 25, carbs: 90, fat: 25, description: 'Bowl of rice with kidney beans curry' },
                    dinner: { name: 'Roti with Mixed Veg', calories: 600, protein: 15, carbs: 70, fat: 20, description: '3 rotis with seasonal vegetables' },
                    snack: { name: 'Roasted Chana', calories: 200, protein: 10, carbs: 30, fat: 5, description: 'Handful of roasted chickpeas' }
                }
            }
            return NextResponse.json(mockPlan)
        }

        // Construct prompt for OpenAI
        const prompt = `
      Act as an expert nutritionist specializing in Indian cuisine. Generate a calculated daily meal plan JSON for this user:
      Name: ${req.name}
      Age: ${req.age}, Gender: ${req.gender}, Height: ${req.height}cm, Weight: ${req.weight}kg
      Target Weight: ${req.targetWeight}kg
      Weekly Rate: ${req.weeklyRate}
      Habits: ${req.habits.join(', ')}
      Goals: ${req.selectedGoals.join(', ')}
      Activity Level: ${req.activityLevel}
      Barriers: ${req.barriers.join(', ')}
      Commitment: ${req.pledgeDays} days/week

      Return ONLY a JSON object with this exact structure (no markdown, no extra text):
      {
        "calories": 2200,
        "protein": 150,
        "carbs": 200,
        "fat": 70,
        "message": "A short, punchy 1-sentence motivational summary.",
        "goalSummary": "A very short 2-3 word summary of the strategy e.g. 'Aggressive Cut' or 'Lean Bulk'",
        "meals": {
            "breakfast": { "name": "Dish Name", "calories": 500, "protein": 30, "carbs": 50, "fat": 20, "description": "Brief description" },
            "lunch": { "name": "Dish Name", "calories": 700, "protein": 40, "carbs": 80, "fat": 25, "description": "Brief description" },
            "dinner": { "name": "Dish Name", "calories": 600, "protein": 35, "carbs": 60, "fat": 20, "description": "Brief description" },
            "snack": { "name": "Dish Name", "calories": 300, "protein": 15, "carbs": 30, "fat": 10, "description": "Brief description" }
        }
      }
      
      Requirements:
      1. Strictly Indian Vegetarian/Non-Vegetarian based on habits (default to Indian logic).
      2. Ensure total macros sum up roughly to the daily totals.
      3. Use commonly available Indian ingredients.
      4. Precisely calculate User BMR/TDEE for the target calories.
    `

        // Call OpenAI API
        const openAIResponse = await fetch('https://api.openai.com/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${apiKey}`,
            },
            body: JSON.stringify({
                model: 'gpt-4o-mini',
                messages: [
                    { role: 'system', content: 'You are a precise nutrition API that outputs only JSON.' },
                    { role: 'user', content: prompt },
                ],
            }),
        })

        if (!openAIResponse.ok) {
            const errorText = await openAIResponse.text()
            console.error('OpenAI API error:', errorText)
            return NextResponse.json({ error: 'Failed to call AI' }, { status: 500 })
        }

        const data = await openAIResponse.json()

        if (!data.choices || data.choices.length === 0) {
            return NextResponse.json({ error: 'No response from AI' }, { status: 500 })
        }

        let content = data.choices[0].message.content

        // Clean markdown block if present
        content = content.replace(/^```json\n?/, '').replace(/\n?```$/, '').trim()

        // Parse and return the plan
        const plan: AIPlanResponse = JSON.parse(content)

        return NextResponse.json(plan)
    } catch (error) {
        console.error('Error generating plan:', error)
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
    }
}
