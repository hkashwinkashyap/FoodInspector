//
//  EmbeddedLlmModule.m
//  FoodInspector
//
//  Created by Ashwin Kashyap on 01/03/2025.
//

#import <React/RCTBridgeModule.h>

@interface RCT_EXTERN_MODULE(EmbeddedLlmModule, NSObject)

RCT_EXTERN_METHOD(initialiseLLM)
RCT_EXTERN_METHOD(processText: (NSString *)text
                  resolver:(RCTPromiseResolveBlock)resolver
                  rejecter:(RCTPromiseRejectBlock)rejecter
                  )

@end
