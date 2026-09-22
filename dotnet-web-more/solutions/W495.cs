// W495: Static-like content type mapping / Custom mapping .asset to application/octet-stream
namespace DotnetWeb;
public static class W495{

public static string Map(string path){
var provider=new FileExtensionContentTypeProvider();provider.Mappings[".asset"]="application/octet-stream";return provider.TryGetContentType(path,out var mime)?mime:"application/octet-stream";
}
}
