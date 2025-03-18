monday.com App Setup Instructions
===

Follow these steps to install and configure the monday.com app using either an Access Token or OAuth credentials.

## Using Access Token

Head over to your monday.com homepage and click on your profile image on the top right then click "Developers".

[![](/docs/assets/setup/developers.png)](/docs/assets/setup/developers.png)

On the developers page, click "My Access Tokens", and copy the access token

[![](/docs/assets/setup/access_token.png)](/docs/assets/setup/access_token.png)

After this, copy your access token and monday.com URL and paste them into the Deskpro monday.com App settings tab, and install to complete the integration.

[![](/docs/assets/setup/deskpro_settings.png)](/docs/assets/setup/deskpro_settings.png)

## Using OAuth

Head over to your monday.com homepage and click on your profile image on the top right then click "Developers".

[![](/docs/assets/setup/developers.png)](/docs/assets/setup/developers.png)

On the developers page, click "Create app". You'll be shown a form to create your app, Give it a name, such as "Deskpro App," copy the `Client ID` & `Client Secret`, then click "Save Changes" and enter the credentials in the app settings drawer Deskpro.

[![](/docs/assets/setup/app_setup_form.png)](/docs/assets/setup/app_setup_form.png)

Next, navigate to the "OAuth" section in the side menu. Here, you will need to configure the necessary permissions for your app. In the "Scopes" drawer, select the following scopes: `me:read`, `boards:read`, `boards:write`, `users:read`, `workspaces:read`, `updates:read`, and `updates:write`. These permissions ensure that your app can access the required data from monday.com while maintaining security and control over what it can modify.

[![](/docs/assets/setup/app_oauth_permissions.png)](/docs/assets/setup/app_oauth_permissions.png)

Once the scopes have been configured, you must set up the redirect URLs. In the "Redirect URLs" section, enter the Callback URL provided in the Deskpro settings drawer. After entering the URL, save your changes by clicking Save Scopes, then click "Promote to Live" in the sidebar to complete the setup.

[![](/docs/assets/setup/app_redirect_url.png)](/docs/assets/setup/app_redirect_url.png)


Finally, configure who can access the app by going to the "Permissions" tab. Select the users and/or groups that should have access. Once you’re satisfied with the settings, click "Install" to complete the setup.