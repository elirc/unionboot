// W498: Static-like content type mapping / Custom mapping .snap to image/png
namespace DotnetWeb;
public static class W498{

public static string Map(string path){
var provider=new FileExtensionContentTypeProvider();provider.Mappings[".snap"]="image/png";return provider.TryGetContentType(path,out var mime)?mime:"application/octet-stream";
}
}
