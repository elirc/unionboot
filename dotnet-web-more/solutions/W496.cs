// W496: Static-like content type mapping / Custom mapping .feedx to application/xml
namespace DotnetWeb;
public static class W496{

public static string Map(string path){
var provider=new FileExtensionContentTypeProvider();provider.Mappings[".feedx"]="application/xml";return provider.TryGetContentType(path,out var mime)?mime:"application/octet-stream";
}
}
