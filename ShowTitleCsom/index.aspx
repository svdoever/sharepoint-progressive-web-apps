<%@ Page Language="C#" %>
<%@ Register TagPrefix="WebPartPages" Namespace="Microsoft.SharePoint.WebPartPages" Assembly="Microsoft.SharePoint, Version=15.0.0.0, Culture=neutral, PublicKeyToken=71e9bce111e9429c" %>
<WebPartPages:AllowFraming ID="AllowFraming" runat="server" />
<%@ Register Tagprefix="SharePoint" Namespace="Microsoft.SharePoint.WebControls" Assembly="Microsoft.SharePoint, Version=15.0.0.0, Culture=neutral, PublicKeyToken=71e9bce111e9429c" %>
<%@ Import Namespace="Microsoft.SharePoint" %>

<!DOCTYPE html>
<html>
    <head>
        <title>Show title using CSOM</title>
        <meta name="viewport" content="width=device-width, maximum-scale=1, user-scalable=no" />

        <!-- the following 5 js files are required to use CSOM -->
        <script type="text/javascript" src="/_layouts/1033/init.js"></script>
        <script type="text/javascript" src="/_layouts/15/MicrosoftAjax.js"></script>
        <script type="text/javascript" src="/_layouts/15/sp.core.js"></script>
        <script type="text/javascript" src="/_layouts/15/sp.runtime.js"></script>
        <script type="text/javascript" src="/_layouts/15/sp.js"></script>
    </head>
    <body>
        <form runat="server">
            <SharePoint:FormDigest ID="FormDigest1" runat="server"></SharePoint:FormDigest>
        </form>

       <h1 id="title">Loading...</h1>
 
        <script>
            var clientCtx = SP.ClientContext.get_current();
            var web = clientCtx.get_web();
            clientCtx.load(web);
            clientCtx.executeQueryAsync(function() {
                var titleElement = document.getElementById('title');
                titleElement.innerHTML = web.get_title();
            }, function(sender, args) {
               console.log("Error:" + args.get_message());
            });
        </script>
    </body>
</html>
