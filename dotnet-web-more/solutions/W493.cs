// W493: Static-like content type mapping / Custom mapping .report to text/csv
namespace DotnetWeb;
public static class W493{

public static string Map(string path){
var provider=new FileExtensionContentTypeProvider();provider.Mappings[".report"]="text/csv";return provider.TryGetContentType(path,out var mime)?mime:"application/octet-stream";
}
}
