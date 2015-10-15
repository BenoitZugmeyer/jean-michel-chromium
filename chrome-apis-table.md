# Chromium APIs table

### [chrome.accessibilityFeatures](https://developer.chrome.com/apps/accessibilityFeatures)

| Apps | Extensions | Permission | Caution |
| :---: | :---: | --- | --- |
| 37 | 37 | <code> &quot;accessibilityFeatures.read&quot; </code> | **Important: This API works only on Chrome OS.** |

Use the <code>chrome.accessibilityFeatures</code> API to manage Chrome&apos;s accessibility features. This API relies on the <a href="https://developer.chrome.com/apps/types#ChromeSetting">ChromeSetting prototype of the type API</a> for getting and setting individual accessibility features. In order to get feature states the extension must request <code>accessibilityFeatures.read</code> permission. For modifying feature state, the extension needs <code>accessibilityFeatures.modify</code> permission. Note that <code>accessibilityFeatures.modify</code> does not imply <code>accessibilityFeatures.read</code> permission.

### [chrome.alarms](https://developer.chrome.com/apps/alarms)

| Apps | Extensions | Permission |
| :---: | :---: | --- |
| 22 | 22 | <code> &quot;alarms&quot; </code> |

Use the <code>chrome.alarms</code> API to schedule code to run periodically or at a specified time in the future.

### [chrome.app.runtime](https://developer.chrome.com/apps/app.runtime)

| Apps | Extensions |
| :---: | :---: |
| 23 |  -  |

Use the <code>chrome.app.runtime</code> API to manage the app lifecycle. The app runtime manages app installation, controls the event page, and can shut down the app at anytime.

### [chrome.app.window](https://developer.chrome.com/apps/app.window)

| Apps | Extensions |
| :---: | :---: |
| 23 |  -  |

Use the <code>chrome.app.window</code> API to create windows. Windows have an optional frame with title bar and size controls. They are not associated with any Chrome browser windows. See the <a href="https://github.com/GoogleChrome/chrome-app-samples/tree/master/samples/window-state"> Window State Sample</a> for a demonstration of these options.

### [chrome.bluetooth](https://developer.chrome.com/apps/bluetooth)

| Apps | Extensions | Manifest | Caution |
| :---: | :---: | --- | --- |
| 37 |  -  | <code> &quot;bluetooth&quot;: {...} </code> | **Important: This API works only on OS X, Windows and Chrome OS.** |

Use the <code>chrome.bluetooth</code> API to connect to a Bluetooth device. All functions report failures via chrome.runtime.lastError.

### [chrome.bluetoothLowEnergy](https://developer.chrome.com/apps/bluetoothLowEnergy)

| Apps | Extensions | Manifest | Caution |
| :---: | :---: | --- | --- |
| 37 |  -  | <code> &quot;bluetooth&quot;: {...} </code> | **Important: This API works only on Chrome OS.** |

The <code>chrome.bluetoothLowEnergy</code> API is used to communicate with Bluetooth Smart (Low Energy) devices using the <a href="https://developer.bluetooth.org/TechnologyOverview/Pages/GATT.aspx"> Generic Attribute Profile (GATT)</a>.

### [chrome.bluetoothSocket](https://developer.chrome.com/apps/bluetoothSocket)

| Apps | Extensions | Manifest | Caution |
| :---: | :---: | --- | --- |
| 37 |  -  | <code> &quot;bluetooth&quot;: {...} </code> | **Important: This API works only on OS X, Windows and Chrome OS.** |

Use the <code>chrome.bluetoothSocket</code> API to send and receive data to Bluetooth devices using RFCOMM and L2CAP connections.

### [chrome.bookmarks](https://developer.chrome.com/extensions/bookmarks)

| Apps | Extensions | Permission |
| :---: | :---: | --- |
|  -  | 5 | <code> &quot;bookmarks&quot; </code> |

Use the <code>chrome.bookmarks</code> API to create, organize, and otherwise manipulate bookmarks. Also see <a href="https://developer.chrome.com/extensions/override">Override Pages</a>, which you can use to create a custom Bookmark Manager page.

### [chrome.browser](https://developer.chrome.com/apps/browser)

| Apps | Extensions | Permission |
| :---: | :---: | --- |
| 42 |  -  | <code> &quot;browser&quot; </code> |

Use the <code>chrome.browser</code> API to interact with the Chrome browser associated with the current application and Chrome profile.

### [chrome.browserAction](https://developer.chrome.com/extensions/browserAction)

| Apps | Extensions | Manifest |
| :---: | :---: | --- |
|  -  | 5 | <code> &quot;browser_action&quot;: {...} </code> |

Use browser actions to put icons in the main Google Chrome toolbar, to the right of the address bar. In addition to its <a href="https://developer.chrome.com/extensions/browserAction#icon">icon</a>, a browser action can also have a <a href="https://developer.chrome.com/extensions/browserAction#tooltip">tooltip</a>, a <a href="https://developer.chrome.com/extensions/browserAction#badge">badge</a>, and a <a href="https://developer.chrome.com/extensions/browserAction#popups">popup</a>.

### [chrome.browsingData](https://developer.chrome.com/extensions/browsingData)

| Apps | Extensions | Permission | Caution |
| :---: | :---: | --- | --- |
|  -  | 19 | <code> &quot;browsingData&quot; </code> | **Important: Removing browsing data involves a good deal of heavy lifting in the background, and can take tens of seconds to complete, depending on a user's profile. You should use the callback mechanism to keep your users up to date on the removal's status.  Seriously: Be careful with protectedWeb and extension. These are destructive operations that your users will write angry email about if they're not well-informed about what to expect when your extension removes data on their behalf.** |

Use the <code>chrome.browsingData</code> API to remove browsing data from a user&apos;s local profile.

### [chrome.certificateProvider](https://developer.chrome.com/extensions/certificateProvider)

| Apps | Extensions | Permission | Caution |
| :---: | :---: | --- | --- |
|  -  | 46 | <code> &quot;certificateProvider&quot; </code> | **Important: This API works only on Chrome OS.** |

Use this API to expose certificates to the platform which can use these certificates for TLS authentications.

### [chrome.commands](https://developer.chrome.com/apps/commands)

| Apps | Extensions | Manifest |
| :---: | :---: | --- |
| 35 | 25 | <code> &quot;commands&quot;: {...} </code> |

Use the commands API to add keyboard shortcuts that trigger actions in your extension, for example, an action to open the browser action or send a command to the extension.

### [chrome.contentSettings](https://developer.chrome.com/extensions/contentSettings)

| Apps | Extensions | Permission |
| :---: | :---: | --- |
|  -  | 16 | <code> &quot;contentSettings&quot; </code> |

Use the <code>chrome.contentSettings</code> API to change settings that control whether websites can use features such as cookies, JavaScript, and plugins. More generally speaking, content settings allow you to customize Chrome&apos;s behavior on a per-site basis instead of globally.

### [chrome.contextMenus](https://developer.chrome.com/apps/contextMenus)

| Apps | Extensions | Permission |
| :---: | :---: | --- |
| 6 | 6 | <code> &quot;contextMenus&quot; </code> |

Use the <code>chrome.contextMenus</code> API to add items to Google Chrome&apos;s context menu. You can choose what types of objects your context menu additions apply to, such as images, hyperlinks, and pages.

### [chrome.cookies](https://developer.chrome.com/extensions/cookies)

| Apps | Extensions | Permission |
| :---: | :---: | --- |
|  -  | 6 | <code> &quot;cookies&quot; </code>  <a href="https://developer.chrome.com/extensions/declare_permissions#host-permissions"> host permissions </a> |

Use the <code>chrome.cookies</code> API to query and modify cookies, and to be notified when they change.

### [chrome.debugger](https://developer.chrome.com/extensions/debugger)

| Apps | Extensions | Permission |
| :---: | :---: | --- |
|  -  | 18 | <code> &quot;debugger&quot; </code> |

The <code>chrome.debugger</code> API serves as an alternate transport for Chrome&apos;s <a href="https://developer.chrome.com/devtools/docs/debugger-protocol">remote debugging protocol</a>. Use <code>chrome.debugger</code> to attach to one or more tabs to instrument network interaction, debug JavaScript, mutate the DOM and CSS, etc. Use the Debuggee <code>tabId</code> to target tabs with sendCommand and route events by <code>tabId</code> from onEvent callbacks.

### [chrome.declarativeContent](https://developer.chrome.com/extensions/declarativeContent)

| Apps | Extensions | Permission |
| :---: | :---: | --- |
|  -  | 33 | <code> &quot;declarativeContent&quot; </code> |

Use the <code>chrome.declarativeContent</code> API to take actions depending on the content of a page, without requiring permission to read the page&apos;s content.

### [chrome.desktopCapture](https://developer.chrome.com/extensions/desktopCapture)

| Apps | Extensions | Permission |
| :---: | :---: | --- |
|  -  | 34 | <code> &quot;desktopCapture&quot; </code> |

Desktop Capture API that can be used to capture content of screen, individual windows or tabs.

### [chrome.devtools.inspectedWindow](https://developer.chrome.com/extensions/devtools.inspectedWindow)

| Apps | Extensions | Caution |
| :---: | :---: | --- |
|  -  | 18 | **Important: Due to the security considerations explained above, the tabs.executeScript method is the preferred way for an extension to access DOM data of the inspected page in cases where the access to JavaScript state of the inspected page is not required.** |

Use the <code>chrome.devtools.inspectedWindow</code> API to interact with the inspected window: obtain the tab ID for the inspected page, evaluate the code in the context of the inspected window, reload the page, or obtain the list of resources within the page.

### [chrome.devtools.network](https://developer.chrome.com/extensions/devtools.network)

| Apps | Extensions |
| :---: | :---: |
|  -  | 18 |

Use the <code>chrome.devtools.network</code> API to retrieve the information about network requests displayed by the Developer Tools in the Network panel.

### [chrome.devtools.panels](https://developer.chrome.com/extensions/devtools.panels)

| Apps | Extensions |
| :---: | :---: |
|  -  | 18 |

Use the <code>chrome.devtools.panels</code> API to integrate your extension into Developer Tools window UI: create your own panels, access existing panels, and add sidebars.

### [chrome.documentScan](https://developer.chrome.com/apps/documentScan)

| Apps | Extensions | Permission | Caution |
| :---: | :---: | --- | --- |
| 44 | 44 | <code> &quot;documentScan&quot; </code> | **Important: This API works only on Chrome OS.** |

Use the <code>chrome.documentScan</code> API to discover and retrieve images from attached paper document scanners.

### [chrome.downloads](https://developer.chrome.com/extensions/downloads)

| Apps | Extensions | Permission |
| :---: | :---: | --- |
|  -  | 31 | <code> &quot;downloads&quot; </code> |

Use the <code>chrome.downloads</code> API to programmatically initiate, monitor, manipulate, and search for downloads.

### [chrome.enterprise.deviceAttributes](https://developer.chrome.com/extensions/enterprise.deviceAttributes)

| Apps | Extensions | Permission | Caution |
| :---: | :---: | --- | --- |
|  -  | <strong>Dev</strong> channel only. <a href="https://developer.chrome.com/extensions/api_index#dev_apis">Learn more</a>. | <code> &quot;enterprise.deviceAttributes&quot; </code> | **Important: This API works only on Chrome OS.** |

Use the <code>chrome.enterprise.deviceAttributes</code> API to read device attributes.

### [chrome.enterprise.platformKeys](https://developer.chrome.com/extensions/enterprise.platformKeys)

| Apps | Extensions | Permission | Caution |
| :---: | :---: | --- | --- |
|  -  | 37 | <code> &quot;enterprise.platformKeys&quot; </code> | **Important: This API works only on Chrome OS.** |

Use the <code>chrome.enterprise.platformKeys</code> API to generate hardware-backed keys and to install certificates for these keys. The certificates will be managed by the platform and can be used for TLS authentication, network access or by other extension through <a href="https://developer.chrome.com/extensions/platformKeys">chrome.platformKeys</a>.

### [chrome.events](https://developer.chrome.com/apps/events)

| Apps | Extensions |
| :---: | :---: |
| 21 | 21 |

The <code>chrome.events</code> namespace contains common types used by APIs dispatching events to notify you when something interesting happens.

### [chrome.extension](https://developer.chrome.com/extensions/extension)

| Apps | Extensions |
| :---: | :---: |
|  -  | 5 |

The <code>chrome.extension</code> API has utilities that can be used by any extension page. It includes support for exchanging messages between an extension and its content scripts or between extensions, as described in detail in <a href="https://developer.chrome.com/extensions/messaging">Message Passing</a>.

### [chrome.extensionTypes](https://developer.chrome.com/apps/extensionTypes)

| Apps | Extensions |
| :---: | :---: |
| 39 | 39 |

The <code>chrome.extensionTypes</code> API contains type declarations for Chrome extensions.

### [chrome.fileBrowserHandler](https://developer.chrome.com/extensions/fileBrowserHandler)

| Apps | Extensions | Permission | Caution |
| :---: | :---: | --- | --- |
|  -  | 12 | <code> &quot;fileBrowserHandler&quot; </code> | **Important: This API works only on Chrome OS.** |

Use the <code>chrome.fileBrowserHandler</code> API to extend the Chrome OS file browser. For example, you can use this API to enable users to upload files to your website.

### [chrome.fileSystem](https://developer.chrome.com/apps/fileSystem)

| Apps | Extensions | Permission |
| :---: | :---: | --- |
| 23 |  -  | <code> &quot;fileSystem&quot; </code>  <code> {&quot;fileSystem&quot;: [&quot;write&quot;]} </code>  <code> {&quot;fileSystem&quot;: [&quot;write&quot;, &quot;retainEntries&quot;, &quot;directory&quot;]} </code> |

Use the <code>chrome.fileSystem</code> API to create, read, navigate, and write to the user&apos;s local file system. With this API, Chrome Apps can read and write to a user-selected location. For example, a text editor app can use the API to read and write local documents. All failures are notified via chrome.runtime.lastError.

### [chrome.fileSystemProvider](https://developer.chrome.com/apps/fileSystemProvider)

| Apps | Extensions | Permission | Caution |
| :---: | :---: | --- | --- |
| 40 | 40 | <code> &quot;fileSystemProvider&quot; </code> | **Important: This API works only on Chrome OS.** |

Use the <code>chrome.fileSystemProvider</code> API to create file systems, that can be accessible from the file manager on Chrome OS.

### [chrome.fontSettings](https://developer.chrome.com/extensions/fontSettings)

| Apps | Extensions | Permission |
| :---: | :---: | --- |
|  -  | 22 | <code> &quot;fontSettings&quot; </code> |

Use the <code>chrome.fontSettings</code> API to manage Chrome&apos;s font settings.

### [chrome.gcm](https://developer.chrome.com/apps/gcm)

| Apps | Extensions | Permission |
| :---: | :---: | --- |
| 35 | 35 | <code> &quot;gcm&quot; </code> |

Use <code>chrome.gcm</code> to enable apps and extensions to send and receive messages through the <a href="http://developer.android.com/google/gcm/">Google Cloud Messaging Service</a>.

### [chrome.hid](https://developer.chrome.com/apps/hid)

| Apps | Extensions | Permission |
| :---: | :---: | --- |
| 38 |  -  | <code> &quot;hid&quot; </code> |

Use the <code>chrome.hid</code> API to interact with connected HID devices. This API provides access to HID operations from within the context of an app. Using this API, apps can function as drivers for hardware devices. Errors generated by this API are reported by setting <a href="https://developer.chrome.com/apps/runtime#property-lastError">runtime.lastError</a> and executing the function&apos;s regular callback. The callback&apos;s regular parameters will be undefined in this case.

### [chrome.history](https://developer.chrome.com/extensions/history)

| Apps | Extensions | Permission |
| :---: | :---: | --- |
|  -  | 5 | <code> &quot;history&quot; </code> |

Use the <code>chrome.history</code> API to interact with the browser&apos;s record of visited pages. You can add, remove, and query for URLs in the browser&apos;s history. To override the history page with your own version, see <a href="https://developer.chrome.com/extensions/override">Override Pages</a>.

### [chrome.i18n](https://developer.chrome.com/apps/i18n)

| Apps | Extensions |
| :---: | :---: |
| 5 | 5 |

Use the <code>chrome.i18n</code> infrastructure to implement internationalization across your whole app or extension.

### [chrome.identity](https://developer.chrome.com/apps/identity)

| Apps | Extensions | Permission |
| :---: | :---: | --- |
| 29 | 29 | <code> &quot;identity&quot; </code> |

Use the <code>chrome.identity</code> API to get OAuth2 access tokens.

### [chrome.idle](https://developer.chrome.com/apps/idle)

| Apps | Extensions | Permission |
| :---: | :---: | --- |
| 6 | 6 | <code> &quot;idle&quot; </code> |

Use the <code>chrome.idle</code> API to detect when the machine&apos;s idle state changes.

### [chrome.input.ime](https://developer.chrome.com/extensions/input.ime)

| Apps | Extensions | Permission |
| :---: | :---: | --- |
|  -  | 21 | <code> &quot;input&quot; </code> |

Use the <code>chrome.input.ime</code> API to implement a custom IME for Chrome OS. This allows your extension to handle keystrokes, set the composition, and manage the candidate window.

### [chrome.instanceID](https://developer.chrome.com/apps/instanceID)

| Apps | Extensions | Permission |
| :---: | :---: | --- |
| 46 | 46 | <code> &quot;gcm&quot; </code> |

Use <code>chrome.instanceID</code> to access the Instance ID service.

### [chrome.management](https://developer.chrome.com/extensions/management)

| Apps | Extensions | Permission |
| :---: | :---: | --- |
|  -  | 8 | <code> &quot;management&quot; </code> |

The <code>chrome.management</code> API provides ways to manage the list of extensions/apps that are installed and running. It is particularly useful for extensions that <a href="https://developer.chrome.com/extensions/override">override</a> the built-in New Tab page.

### [chrome.mdns](https://developer.chrome.com/apps/mdns)

| Apps | Extensions | Permission |
| :---: | :---: | --- |
| 31 |  -  | <code> &quot;mdns&quot; </code> |

Use the <code>chrome.mdns</code> API to discover services over mDNS. This comprises a subset of the features of the NSD spec: http://www.w3.org/TR/discovery-api/

### [chrome.mediaGalleries](https://developer.chrome.com/apps/mediaGalleries)

| Apps | Extensions | Permission |
| :---: | :---: | --- |
| 23 |  -  | <code> {&quot;mediaGalleries&quot;: [&quot;accessType1&quot;, &quot;accessType2&quot;, ...]} </code>  <code> {&quot;mediaGalleries&quot;: [&quot;accessType1&quot;, &quot;accessType2&quot;, ..., &quot;allAutoDetected&quot;]} </code>  See <a href="https://developer.chrome.com/apps/mediaGalleries#manifest">Manifest</a> below for more information. |

Use the <code>chrome.mediaGalleries</code> API to access media files (audio, images, video) from the user&apos;s local disks (with the user&apos;s consent).

### [chrome.networking.config](https://developer.chrome.com/extensions/networking.config)

| Apps | Extensions | Permission | Caution |
| :---: | :---: | --- | --- |
|  -  | 43 | <code> &quot;networking.config&quot; </code> | **Important: This API works only on Chrome OS.** |

Use the <code>networking.config</code> API to authenticate to captive portals.

### [chrome.notifications](https://developer.chrome.com/apps/notifications)

| Apps | Extensions | Permission |
| :---: | :---: | --- |
| 28 | 28 | <code> &quot;notifications&quot; </code> |

Use the <code>chrome.notifications</code> API to create rich notifications using templates and show these notifications to users in the system tray.

### [chrome.omnibox](https://developer.chrome.com/extensions/omnibox)

| Apps | Extensions | Manifest |
| :---: | :---: | --- |
|  -  | 9 | <code> &quot;omnibox&quot;: {...} </code> |

The omnibox API allows you to register a keyword with Google Chrome&apos;s address bar, which is also known as the omnibox.

### [chrome.pageAction](https://developer.chrome.com/extensions/pageAction)

| Apps | Extensions | Manifest |
| :---: | :---: | --- |
|  -  | 5 | <code> &quot;page_action&quot;: {...} </code> |

Use the <code>chrome.pageAction</code> API to put icons inside the address bar. Page actions represent actions that can be taken on the current page, but that aren&apos;t applicable to all pages.

### [chrome.pageCapture](https://developer.chrome.com/extensions/pageCapture)

| Apps | Extensions | Permission |
| :---: | :---: | --- |
|  -  | 18 | <code> &quot;pageCapture&quot; </code> |

Use the <code>chrome.pageCapture</code> API to save a tab as MHTML.

### [chrome.permissions](https://developer.chrome.com/apps/permissions)

| Apps | Extensions |
| :---: | :---: |
| 16 | 16 |

Use the <code>chrome.permissions</code> API to request <a href="https://developer.chrome.com/apps/permissions#manifest">declared optional permissions</a> at run time rather than install time, so users understand why the permissions are needed and grant only those that are necessary.

### [chrome.platformKeys](https://developer.chrome.com/extensions/platformKeys)

| Apps | Extensions | Permission | Caution |
| :---: | :---: | --- | --- |
|  -  | 45 | <code> &quot;platformKeys&quot; </code> | **Important: This API works only on Chrome OS.** |

Use the <code>chrome.platformKeys</code> API to access client certificates managed by the platform. If the user or policy grants the permission, an extension can use such a certficate in its custom authentication protocol. E.g. this allows usage of platform managed certificates in third party VPNs (see <a href="https://developer.chrome.com/extensions/vpnProvider">chrome.vpnProvider</a>).

### [chrome.power](https://developer.chrome.com/apps/power)

| Apps | Extensions | Permission |
| :---: | :---: | --- |
| 27 | 27 | <code> &quot;power&quot; </code> |

Use the <code>chrome.power</code> API to override the system&apos;s power management features.

### [chrome.printerProvider](https://developer.chrome.com/apps/printerProvider)

| Apps | Extensions | Permission |
| :---: | :---: | --- |
| 44 | 44 | <code> &quot;printerProvider&quot; </code> |

The <code>chrome.printerProvider</code> API exposes events used by print manager to query printers controlled by extensions, to query their capabilities and to submit print jobs to these printers.

### [chrome.privacy](https://developer.chrome.com/extensions/privacy)

| Apps | Extensions | Permission |
| :---: | :---: | --- |
|  -  | 18 | <code> &quot;privacy&quot; </code> |

Use the <code>chrome.privacy</code> API to control usage of the features in Chrome that can affect a user&apos;s privacy. This API relies on the <a href="https://developer.chrome.com/extensions/types#ChromeSetting">ChromeSetting prototype of the type API</a> for getting and setting Chrome&apos;s configuration.

### [chrome.proxy](https://developer.chrome.com/extensions/proxy)

| Apps | Extensions | Permission |
| :---: | :---: | --- |
|  -  | 13 | <code> &quot;proxy&quot; </code> |

Use the <code>chrome.proxy</code> API to manage Chrome&apos;s proxy settings. This API relies on the <a href="https://developer.chrome.com/extensions/types#ChromeSetting">ChromeSetting prototype of the type API</a> for getting and setting the proxy configuration.

### [chrome.runtime](https://developer.chrome.com/apps/runtime)

| Apps | Extensions |
| :---: | :---: |
| 22 | 22 |

Use the <code>chrome.runtime</code> API to retrieve the background page, return details about the manifest, and listen for and respond to events in the app or extension lifecycle. You can also use this API to convert the relative path of URLs to fully-qualified URLs.

### [chrome.serial](https://developer.chrome.com/apps/serial)

| Apps | Extensions | Permission |
| :---: | :---: | --- |
| 23 |  -  | <code> &quot;serial&quot; </code> |

Use the <code>chrome.serial</code> API to read from and write to a device connected to a serial port.

### [chrome.sessions](https://developer.chrome.com/extensions/sessions)

| Apps | Extensions | Permission |
| :---: | :---: | --- |
|  -  | 37 | <code> &quot;sessions&quot; </code> |

Use the <code>chrome.sessions</code> API to query and restore tabs and windows from a browsing session.

### [chrome.socket](https://developer.chrome.com/apps/socket)

| Apps | Extensions | Permission |
| :---: | :---: | --- |
| 24 |  -  | <code> {&quot;socket&quot;: [&quot;rule1&quot;, &quot;rule2&quot;]} </code>  For example: <code>{&quot;socket&quot;: [&quot;tcp-connect:*:*&quot;]}</code> means connecting on any port of any host. See <a href="https://developer.chrome.com/apps/app_network">Network Communications</a> for rule syntax. |

Use the <code>chrome.socket</code> API to send and receive data over the network using TCP and UDP connections. <b>Note:</b> Starting with Chrome 33, this API is deprecated in favor of the <a href="https://developer.chrome.com/apps/sockets.udp">sockets.udp</a>, <a href="https://developer.chrome.com/apps/sockets.tcp">sockets.tcp</a> and <a href="https://developer.chrome.com/apps/sockets.tcpServer">sockets.tcpServer</a> APIs.

### [chrome.sockets.tcp](https://developer.chrome.com/apps/sockets.tcp)

| Apps | Extensions | Manifest |
| :---: | :---: | --- |
| 33 |  -  | <code> &quot;sockets&quot;: {...} </code> |

Use the <code>chrome.sockets.tcp</code> API to send and receive data over the network using TCP connections. This API supersedes the TCP functionality previously found in the <code>chrome.socket</code> API.

### [chrome.sockets.tcpServer](https://developer.chrome.com/apps/sockets.tcpServer)

| Apps | Extensions | Manifest |
| :---: | :---: | --- |
| 33 |  -  | <code> &quot;sockets&quot;: {...} </code> |

Use the <code>chrome.sockets.tcpServer</code> API to create server applications using TCP connections. This API supersedes the TCP functionality previously found in the <code>chrome.socket</code> API.

### [chrome.sockets.udp](https://developer.chrome.com/apps/sockets.udp)

| Apps | Extensions | Manifest |
| :---: | :---: | --- |
| 33 |  -  | <code> &quot;sockets&quot;: {...} </code> |

Use the <code>chrome.sockets.udp</code> API to send and receive data over the network using UDP connections. This API supersedes the UDP functionality previously found in the &quot;socket&quot; API.

### [chrome.storage](https://developer.chrome.com/apps/storage)

| Apps | Extensions | Permission |
| :---: | :---: | --- |
| 20 | 20 | <code> &quot;storage&quot; </code> |

Use the <code>chrome.storage</code> API to store, retrieve, and track changes to user data.

### [chrome.syncFileSystem](https://developer.chrome.com/apps/syncFileSystem)

| Apps | Extensions | Permission |
| :---: | :---: | --- |
| 27 |  -  | <code> &quot;syncFileSystem&quot; </code> |

Use the <code>chrome.syncFileSystem</code> API to save and synchronize data on Google Drive. This API is NOT for accessing arbitrary user docs stored in Google Drive. It provides app-specific syncable storage for offline and caching usage so that the same data can be available across different clients. Read <a href="https://developer.chrome.com/apps/app_storage.html">Manage Data</a> for more on using this API.

### [chrome.system.cpu](https://developer.chrome.com/apps/system.cpu)

| Apps | Extensions | Permission |
| :---: | :---: | --- |
| 32 | 32 | <code> &quot;system.cpu&quot; </code> |

Use the <code>system.cpu</code> API to query CPU metadata.

### [chrome.system.display](https://developer.chrome.com/apps/system.display)

| Apps | Extensions | Permission |
| :---: | :---: | --- |
| 30 |  -  | <code> &quot;system.display&quot; </code> |

Use the <code>system.display</code> API to query display metadata.

### [chrome.system.memory](https://developer.chrome.com/apps/system.memory)

| Apps | Extensions | Permission |
| :---: | :---: | --- |
| 32 | 32 | <code> &quot;system.memory&quot; </code> |

The <code>chrome.system.memory</code> API.

### [chrome.system.network](https://developer.chrome.com/apps/system.network)

| Apps | Extensions | Permission |
| :---: | :---: | --- |
| 33 |  -  | <code> &quot;system.network&quot; </code> |

Use the <code>chrome.system.network</code> API.

### [chrome.system.storage](https://developer.chrome.com/apps/system.storage)

| Apps | Extensions | Permission |
| :---: | :---: | --- |
| 30 | 30 | <code> &quot;system.storage&quot; </code> |

Use the <code>chrome.system.storage</code> API to query storage device information and be notified when a removable storage device is attached and detached.

### [chrome.tabCapture](https://developer.chrome.com/extensions/tabCapture)

| Apps | Extensions | Permission |
| :---: | :---: | --- |
|  -  | 31 | <code> &quot;tabCapture&quot; </code> |

Use the <code>chrome.tabCapture</code> API to interact with tab media streams.

### [chrome.tabs](https://developer.chrome.com/extensions/tabs)

| Apps | Extensions | Permission |
| :---: | :---: | --- |
|  -  | 5 | The majority of the <code>chrome.tabs</code> API can be used without declaring any permission. However, the <code>&quot;tabs&quot;</code> permission is required in order to populate the <code><a href="https://developer.chrome.com/extensions/tabs#property-Tab-url">url</a></code>, <code><a href="https://developer.chrome.com/extensions/tabs#property-Tab-title">title</a></code>, and <code><a href="https://developer.chrome.com/extensions/tabs#property-Tab-favIconUrl">favIconUrl</a></code> properties of <code><a href="https://developer.chrome.com/extensions/tabs#type-Tab">Tab</a></code>. |

Use the <code>chrome.tabs</code> API to interact with the browser&apos;s tab system. You can use this API to create, modify, and rearrange tabs in the browser.

### [chrome.topSites](https://developer.chrome.com/extensions/topSites)

| Apps | Extensions | Permission |
| :---: | :---: | --- |
|  -  | 19 | <code> &quot;topSites&quot; </code> |

Use the <code>chrome.topSites</code> API to access the top sites that are displayed on the new tab page.

### [chrome.tts](https://developer.chrome.com/apps/tts)

| Apps | Extensions | Permission |
| :---: | :---: | --- |
| 14 | 14 | <code> &quot;tts&quot; </code> |

Use the <code>chrome.tts</code> API to play synthesized text-to-speech (TTS). See also the related <a href="http://developer.chrome.com/extensions/ttsEngine">ttsEngine</a> API, which allows an extension to implement a speech engine.

### [chrome.ttsEngine](https://developer.chrome.com/extensions/ttsEngine)

| Apps | Extensions | Permission |
| :---: | :---: | --- |
|  -  | 14 | <code> &quot;ttsEngine&quot; </code> |

Use the <code>chrome.ttsEngine</code> API to implement a text-to-speech(TTS) engine using an extension. If your extension registers using this API, it will receive events containing an utterance to be spoken and other parameters when any extension or Chrome App uses the <a href="https://developer.chrome.com/extensions/tts">tts</a> API to generate speech. Your extension can then use any available web technology to synthesize and output the speech, and send events back to the calling function to report the status.

### [chrome.types](https://developer.chrome.com/apps/types)

| Apps | Extensions |
| :---: | :---: |
| 13 | 13 |

The <code>chrome.types</code> API contains type declarations for Chrome.

### [chrome.usb](https://developer.chrome.com/apps/usb)

| Apps | Extensions | Permission |
| :---: | :---: | --- |
| 26 |  -  | <code> &quot;usb&quot; </code> |

Use the <code>chrome.usb</code> API to interact with connected USB devices. This API provides access to USB operations from within the context of an app. Using this API, apps can function as drivers for hardware devices. Errors generated by this API are reported by setting <a href="https://developer.chrome.com/apps/runtime#property-lastError">runtime.lastError</a> and executing the function&apos;s regular callback. The callback&apos;s regular parameters will be undefined in this case.

### [chrome.vpnProvider](https://developer.chrome.com/apps/vpnProvider)

| Apps | Extensions | Permission | Caution |
| :---: | :---: | --- | --- |
| 43 | 43 | <code> &quot;vpnProvider&quot; </code> | **Important: This API works only on Chrome OS.** |

Use the <code>chrome.vpnProvider</code> API to implement a VPN client.

### [chrome.wallpaper](https://developer.chrome.com/apps/wallpaper)

| Apps | Extensions | Permission | Caution |
| :---: | :---: | --- | --- |
| 43 | 43 | <code> &quot;wallpaper&quot; </code> | **Important: This API works only on Chrome OS.** |

Use the <code>chrome.wallpaper</code> API to change the ChromeOS wallpaper.

### [chrome.webNavigation](https://developer.chrome.com/extensions/webNavigation)

| Apps | Extensions | Permission |
| :---: | :---: | --- |
|  -  | 16 | <code> &quot;webNavigation&quot; </code> |

Use the <code>chrome.webNavigation</code> API to receive notifications about the status of navigation requests in-flight.

### [chrome.webRequest](https://developer.chrome.com/extensions/webRequest)

| Apps | Extensions | Permission |
| :---: | :---: | --- |
|  -  | 17 | <code> &quot;webRequest&quot; </code>  <a href="https://developer.chrome.com/extensions/declare_permissions#host-permissions"> host permissions </a> |

Use the <code>chrome.webRequest</code> API to observe and analyze traffic and to intercept, block, or modify requests in-flight.

### [chrome.webstore](https://developer.chrome.com/extensions/webstore)

| Apps | Extensions |
| :---: | :---: |
|  -  | 15 |

Use the <code>chrome.webstore</code> API to initiate app and extension installations &quot;inline&quot; from your site.

### [chrome.windows](https://developer.chrome.com/extensions/windows)

| Apps | Extensions | Permission |
| :---: | :---: | --- |
|  -  | 5 | The <code>chrome.windows</code> API can be used without declaring any permission. However, the <code>&quot;tabs&quot;</code> permission is required in order to populate the <code><a href="https://developer.chrome.com/extensions/tabs#property-Tab-url">url</a></code>, <code><a href="https://developer.chrome.com/extensions/tabs#property-Tab-title">title</a></code>, and <code><a href="https://developer.chrome.com/extensions/tabs#property-Tab-favIconUrl">favIconUrl</a></code> properties of <code><a href="https://developer.chrome.com/extensions/tabs#type-Tab">Tab</a></code> objects. |

Use the <code>chrome.windows</code> API to interact with browser windows. You can use this API to create, modify, and rearrange windows in the browser.

