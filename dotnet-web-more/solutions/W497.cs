// W497: Static-like content type mapping / Custom mapping .catalog to application/json
namespace DotnetWeb;
public static class W497{

public static string Map(string path){
var provider=new FileExtensionContentTypeProvider();provider.Mappings[".catalog"]="application/json";return provider.TryGetContentType(path,out var mime)?mime:"application/octet-stream";
}
}
