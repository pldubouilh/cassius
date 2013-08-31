#import "ContentView.h"
#import "WebViewDelegate.h"
#import "AppDelegate.h"
#import "JSEventHelper.h"

@interface WebPreferences (WebPreferencesPrivate)
    - (void)_setLocalStorageDatabasePath:(NSString *)path;
    - (void) setLocalStorageEnabled: (BOOL) localStorageEnabled;
    - (void) setDatabasesEnabled:(BOOL)databasesEnabled;
    - (void) setDeveloperExtrasEnabled:(BOOL)developerExtrasEnabled;
    - (void) setWebGLEnabled:(BOOL)webGLEnabled;
    - (void) setOfflineWebApplicationCacheEnabled:(BOOL)offlineWebApplicationCacheEnabled;
@end

@implementation ContentView

@synthesize webView, delegate;

- (void) awakeFromNib
{
    WebPreferences *webPrefs = [WebPreferences standardPreferences];
    NSString *cappBundleName = [[[NSBundle mainBundle] infoDictionary] objectForKey:@"CFBundleName"];    
    
    NSUserDefaults *defaults = [NSUserDefaults standardUserDefaults];
    
    NSString *applicationSupportFile = [defaults stringForKey:@"dbLocationAJ"];
    
    // If nil, set default location
    if(applicationSupportFile == nil ){
        applicationSupportFile = [@"~/Library/Application Support/ " stringByExpandingTildeInPath];
        applicationSupportFile = [applicationSupportFile substringWithRange:NSMakeRange(0,applicationSupportFile.length-1)];

        [defaults setObject:applicationSupportFile forKey:@"dbLocationAJ"];
    }
    
    // Initial Folder
    //NSString *savePath = [NSString pathWithComponents:[NSArray arrayWithObjects:applicationSupportFile, cappBundleName, @"LocalStorage", nil]];
    
    
    // Fancy folder
    NSString *savePath = [NSString pathWithComponents:[NSArray arrayWithObjects:applicationSupportFile, [NSString stringWithFormat:@"%@%@", cappBundleName, @"/ "], nil]];
    savePath = [savePath substringWithRange:NSMakeRange(0,savePath.length-1)];
    
    NSLog(@"%@", applicationSupportFile);
    NSLog(@"%@", savePath);

    [webPrefs _setLocalStorageDatabasePath:savePath];
    [webPrefs setLocalStorageEnabled:YES];
    [webPrefs setDatabasesEnabled:YES];
    [webPrefs setDeveloperExtrasEnabled:[[NSUserDefaults standardUserDefaults] boolForKey: @"developer"]];
    [webPrefs setOfflineWebApplicationCacheEnabled:YES];
    [webPrefs setWebGLEnabled:YES];
    
    [self.webView setPreferences:webPrefs];
    
    NSHTTPCookieStorage *cookieStorage = [NSHTTPCookieStorage 
                                          sharedHTTPCookieStorage]; 
    [cookieStorage setCookieAcceptPolicy:NSHTTPCookieAcceptPolicyAlways];
    
    [self.webView setApplicationNameForUserAgent: @"Cassius"];
    
	self.delegate = [[WebViewDelegate alloc] init];
	[self.webView setFrameLoadDelegate:self.delegate];
	[self.webView setUIDelegate:self.delegate];
	[self.webView setResourceLoadDelegate:self.delegate];
	[self.webView setDownloadDelegate:self.delegate];
	[self.webView setPolicyDelegate:self.delegate];	
    [self.webView setDrawsBackground:NO];
    [self.webView setShouldCloseWithWindow:NO];
    
    [self.webView setGroupName:@"Cassius"];
    
    

}

- (void) windowResized:(NSNotification*)notification;
{
	NSWindow* window = (NSWindow*)notification.object;
	NSSize size = [window frame].size;
	
	DebugNSLog(@"window width = %f, window height = %f", size.width, size.height);
    
    bool isFullScreen = (window.styleMask & NSFullScreenWindowMask) == NSFullScreenWindowMask;
    int titleBarHeight = isFullScreen ? 0 : [[Utils sharedInstance] titleBarHeight:window];
    
	[self.webView setFrame:NSMakeRect(0, 0, size.width, size.height - titleBarHeight)];
    [JSEventHelper triggerEvent:@"orientationchange" forWebView:self.webView];
    }

@end
