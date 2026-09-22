// W395: Cursor pagination / Page size 5 opaque v1 cursor
namespace DotnetWeb;
public static class W395{

public static IResult Page(IReadOnlyList<int> source,string? cursor){
int start=0;if(!string.IsNullOrEmpty(cursor)){string decoded;try{decoded=Encoding.UTF8.GetString(Convert.FromBase64String(cursor));}catch(FormatException){return Results.StatusCode(400);}var parts=decoded.Split(':');if(parts.Length!=2||parts[0]!="v1"||!int.TryParse(parts[1],out var offset)||offset<0)return Results.StatusCode(400);start=offset;}var page=source.Skip(start).Take(5).ToArray();string? next=start+page.Length<source.Count?Convert.ToBase64String(Encoding.UTF8.GetBytes($"v1:{start+page.Length}")):null;return Results.Ok(new {page,next});
}
}
