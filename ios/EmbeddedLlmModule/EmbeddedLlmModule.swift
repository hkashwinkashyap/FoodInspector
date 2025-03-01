//
//  EmbeddedLlmModule.swift
//  FoodInspector
//
//  Created by Ashwin Kashyap on 01/03/2025.
//

import Foundation
import React
import MediaPipeTasksGenAI

@objc(EmbeddedLlmModule)
class EmbeddedLlmModule: NSObject, RCTBridgeModule {
    
    var init_model: LlmInference?

    // Required by React Native to expose the module
    @objc static func moduleName() -> String {
        return "EmbeddedLlmModule"
    }
    
    // Initialize the LLM model
    @objc func initialiseLLM() {
        if init_model == nil {
            init_model = initialise_llm()
        }
    }

    // Function to receive input from React Native and return response
    @objc func processText(_ text: String, resolver: @escaping RCTPromiseResolveBlock, rejecter: @escaping RCTPromiseRejectBlock) {
        initialiseLLM()  // Ensure model is initialized
        
        do {
            let response = try init_model?.generateResponse(inputText: text) ?? "No response"
            resolver(response)
        } catch {
            rejecter("ERROR", "Failed to generate response", error)
        }
    }

    // Required by React Native
    @objc static func requiresMainQueueSetup() -> Bool {
        return false
    }
}

