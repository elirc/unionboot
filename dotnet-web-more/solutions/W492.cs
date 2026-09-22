// W492: Static-like content type mapping / Custom mapping .note to text/plain
namespace DotnetWeb;
public static class W492{

public static string Map(string path){
var provider=new FileExtensionContentTypeProvider();provider.Mappings[".note"]="text/plain";return provider.TryGetContentType(path,out var mime)?mime:"application/octet-stream";
}
}
