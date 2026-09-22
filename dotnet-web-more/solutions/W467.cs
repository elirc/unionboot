// W467: Media type segment versioning / Vendor media segment v7
namespace DotnetWeb;
public static class W467{

public static IResult Select(string? accept){
if(accept is null)return Results.StatusCode(406);foreach(var entry in accept.Split(',')){var media=entry.Split(';')[0].Trim();if(media.Equals("application/vnd.catalog.v7+json",StringComparison.OrdinalIgnoreCase))return Results.Ok(new {version=7});}return Results.StatusCode(406);
}
}
