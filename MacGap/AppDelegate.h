//
//  AppDelegate.h
//  Cassius
//
//  Created by Alex MacCaw on 08/01/2012.
//  Copyright (c) 2012 Twitter. All rights reserved.
//

#import <Cocoa/Cocoa.h>
#import "Classes/ContentView.h"

#import "WindowController.h"

@interface AppDelegate : NSObject <NSApplicationDelegate>

@property (retain, nonatomic) WindowController *windowController;
- (IBAction)save:(id)sender;
- (IBAction)lougout:(id)sender;
- (IBAction)reset:(id)sender;

@end
