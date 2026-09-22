// W462: Media type segment versioning / Vendor media segment v2
namespace DotnetWeb;
public static class W462{

public static IResult Select(string? accept){
if(accept is null)return Results.StatusCode(406);foreach(var entry in accept.Split(',')){var media=entry.Split(';')[0].Trim();if(media.Equals("application/vnd.catalog.v2+json",StringComparison.OrdinalIgnoreCase))return Results.Ok(new {version=2});}return Results.StatusCode(406);
}
}
