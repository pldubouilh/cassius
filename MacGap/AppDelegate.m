//
//  AppDelegate.m
//  Cassius
//
//  Created by Alex MacCaw on 08/01/2012.
//  Copyright (c) 2012 Twitter. All rights reserved.
//


#import "AppDelegate.h"
#import "Classes/WebViewDelegate.h"

@implementation AppDelegate

@synthesize windowController;

- (void) applicationWillFinishLaunching:(NSNotification *)aNotification
{

    
}

-(BOOL)applicationShouldHandleReopen:(NSApplication*)application
                   hasVisibleWindows:(BOOL)visibleWindows{
    if(!visibleWindows){
        [self.windowController.window makeKeyAndOrderFront: nil];
    }
    return YES;
}

- (void) applicationDidFinishLaunching:(NSNotification *)aNotification { 
    self.windowController = [[WindowController alloc] initWithURL: kStartPage];
    [self.windowController showWindow: [NSApplication sharedApplication].delegate];
    self.windowController.contentView.webView.alphaValue = 1.0;
    self.windowController.contentView.alphaValue = 1.0;
    [self.windowController showWindow:self];
}

- (IBAction)save:(id)sender {

}

/**********
    Change DB Location 
 ***********/
- (IBAction)lougout:(id)sender {    
    
    NSUserDefaults *defaults = [NSUserDefaults standardUserDefaults];
    NSString *oldLocation = [defaults stringForKey:@"dbLocationAJ"];
    
    NSOpenPanel *panel = [NSOpenPanel openPanel];
    [panel setCanChooseFiles:NO];
    [panel setCanChooseDirectories:YES]; // Chose save directory
    [panel setAllowsMultipleSelection:NO];
    [panel setTitle:@"Location Desired for the Database (think Bropbox, Owncloud, iCloud, thumbdrive...)"];
    
    NSInteger clicked = [panel runModal];
    
    if (clicked == NSFileHandlingPanelOKButton) {
        for (NSURL *url in [panel URLs]) {
            
            // Remove file://localhost/
            NSString *location = [url.absoluteString substringWithRange:NSMakeRange(16,url.absoluteString.length-16)];
            NSLog(@"url = %@", location);
            
    
            
            NSFileManager *manager = [[NSFileManager alloc] init];
            NSURL *source = [NSURL fileURLWithPath:[NSString stringWithFormat:@"%@%@", oldLocation, @"Cassius/file__0.localstorage" ]];
            NSURL *destination = [NSURL fileURLWithPath:[NSString stringWithFormat:@"%@%@", location, @"Cassius/file__0.localstorage" ]];
            NSLog(@"The source path is %@ and the destation path is %@",source, destination);

            [defaults setObject:location forKey:@"dbLocationAJ"];

            NSString *fileDB = [NSString stringWithFormat:@"%@%@", location, @"Cassius/file__0.localstorage" ];
            if ([manager fileExistsAtPath:fileDB]) {
                [manager removeItemAtPath:fileDB error:nil];
            }
            
            NSString *folder = [NSString stringWithFormat:@"%@%@", location, @"Cassius"];
            
            BOOL isDir;
            if (!([manager fileExistsAtPath:folder isDirectory:&isDir] && isDir)){
                [manager createDirectoryAtPath:folder withIntermediateDirectories:YES attributes:nil error:nil];
                NSLog(@"Creating folder here == %@", folder);
            }
 
            NSError *err;
            [manager moveItemAtPath:[NSString stringWithFormat:@"%@%@", folder, @"/file__0.localstorage"]
                             toPath:[NSString stringWithFormat:@"%@%@", folder, @"/file__0.localstorage"]
                              error:&err];

            [manager moveItemAtURL:source toURL:destination error:&err];
            
            NSAlert* msgBox = [[NSAlert alloc] init];
            [msgBox setMessageText: @"Database moved. You should now restart Cassius."];
            [msgBox addButtonWithTitle: @"Restart"];
            [msgBox runModal];

            [NSApp terminate:self];

        }
    }
}

- (IBAction)reset:(id)sender {
    
    NSAlert *alert = [[NSAlert alloc] init];
    [alert setMessageText:@"Your database will be reseted.                 Everything will be erased.                    Forever."];
    [alert setInformativeText:@"Check to confirm..."];
    [alert setShowsSuppressionButton:YES];
    [alert runModal];
    if ([[alert suppressionButton] state] == NSOnState) {
        
        // Reset
        NSUserDefaults *defaults = [NSUserDefaults standardUserDefaults];
        
        NSString *applicationSupportFile = [@"~/Library/Application Support/ " stringByExpandingTildeInPath];
        applicationSupportFile = [applicationSupportFile substringWithRange:NSMakeRange(0,applicationSupportFile.length-1)];
        
        [defaults setObject:applicationSupportFile forKey:@"dbLocationAJ"];
        
        
        NSFileManager *manager = [[NSFileManager alloc] init];
        
        NSString *cappBundleName = [[[NSBundle mainBundle] infoDictionary] objectForKey:@"CFBundleName"];
        NSString *filePath = [NSString pathWithComponents:[NSArray arrayWithObjects:applicationSupportFile, [NSString stringWithFormat:@"%@/%@", cappBundleName, @"file__0.localstorage"], nil]];
        
        if ([manager fileExistsAtPath:filePath]) {
            [manager removeItemAtPath:filePath error:nil];
        }
        
        NSAlert* msgBox = [[NSAlert alloc] init];
        [msgBox setMessageText: @"Database reseted. You should now restart Cassius."];
        [msgBox addButtonWithTitle: @"Restart"];
        [msgBox runModal];
        
        [NSApp terminate:self];
    }
    
   }
@end
