// W491: Static-like content type mapping / Custom mapping .data to application/json
namespace DotnetWeb;
public static class W491{

public static string Map(string path){
var provider=new FileExtensionContentTypeProvider();provider.Mappings[".data"]="application/json";return provider.TryGetContentType(path,out var mime)?mime:"application/octet-stream";
}
}
