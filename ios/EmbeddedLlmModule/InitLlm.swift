//
//  InitLlm.swift
//  FoodInspector
//
//  Created by Ashwin Kashyap on 01/03/2025.
//

import Foundation
import MediaPipeTasksGenAI


func initialise_llm()->LlmInference?{
    let modelPath = Bundle.main.path(forResource: "gemma-2b-it-cpu-int4",
                                          ofType: "bin")!

    let options = LlmInference.Options(modelPath: modelPath)
    options.modelPath = modelPath
    options.maxTokens = 1000
    
    do {
        let llmInference = try LlmInference(options: options)
        return llmInference
    } catch {
        // Handle the error here
        print("An error occurred: \(error)")
        return nil // Or handle the error in an appropriate way
    }
}
