## How it works
Electrons autoUpdater uses Squirrel. There is some notable differences between how Squirrel works on Windows and Mac.

### On Mac
On Mac, Squirrel does not do any version comparison checks on the client side.
It depends on a server, therefore we need a "server". This is solved by putting a `json` file in your GitHub repository that will act as our server.

#### auto_updater.json
A file named `auto_updater.json` needs to be placed in the root of your repo.

This file should contain at least a `url` key, pointing to the `.zip` file URL in your latest release.
Look [here](https://github.com/Squirrel/Squirrel.Mac#update-json-format) for valid keys.

### On Windows
Squirrel does not require a server on Windows. So no need to keep an `auto_updater.json` updated for the Windows version of your app.


## Publishing a new release on Github
When you create a new release on GitHub this is what you should think of:

- The tag needs to be a valid `semver` version.

**Mac apps:**
- Your `.app` must be [signed](https://github.com/atom/electron/blob/master/docs/api/auto-updater.md#auto-updater) and `zip` compressed.
- Update your `auto_updater.json` file to point to the newly uploaded zipped `.app`.

**Windows apps:**
- Use [grunt-electron-installer](https://github.com/atom/grunt-electron-installer) to create a new installer for your app. Then upload the `RELEASE` and `.nupkg` files as assets to the release.
