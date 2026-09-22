// W494: Static-like content type mapping / Custom mapping .mapx to application/json
namespace DotnetWeb;
public static class W494{

public static string Map(string path){
var provider=new FileExtensionContentTypeProvider();provider.Mappings[".mapx"]="application/json";return provider.TryGetContentType(path,out var mime)?mime:"application/octet-stream";
}
}
