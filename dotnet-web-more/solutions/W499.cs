// W499: Static-like content type mapping / Custom mapping .bundle to application/zip
namespace DotnetWeb;
public static class W499{

public static string Map(string path){
var provider=new FileExtensionContentTypeProvider();provider.Mappings[".bundle"]="application/zip";return provider.TryGetContentType(path,out var mime)?mime:"application/octet-stream";
}
}
