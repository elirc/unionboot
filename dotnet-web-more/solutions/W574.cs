// W574: Response compression decision logic / Compression minimum 400 bytes
namespace DotnetWeb;
public static class W574{

public static string? EncodingFor(string? accept,string mime,long bytes){
if(bytes<400||!new[]{"text/plain","application/json"}.Contains(mime))return null;var encodings=(accept??"").Split(',',StringSplitOptions.TrimEntries|StringSplitOptions.RemoveEmptyEntries);if(encodings.Contains("br"))return "br";if(encodings.Contains("gzip"))return "gzip";return null;
}
}
