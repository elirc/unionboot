// W500: Static-like content type mapping / Custom mapping .docx2 to application/pdf
namespace DotnetWeb;
public static class W500{

public static string Map(string path){
var provider=new FileExtensionContentTypeProvider();provider.Mappings[".docx2"]="application/pdf";return provider.TryGetContentType(path,out var mime)?mime:"application/octet-stream";
}
}
