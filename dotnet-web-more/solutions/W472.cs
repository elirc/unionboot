// W472: Sparse fieldset projection / Default fields title
namespace DotnetWeb;
public static class W472{
public sealed record Item(int Id,string Title,decimal Price,int Stock);
public static IResult Project(Item item,string? fields){
var keys=(fields??"title").Split(',',StringSplitOptions.TrimEntries|StringSplitOptions.RemoveEmptyEntries).Distinct(StringComparer.Ordinal).ToArray();var map=new Dictionary<string,object?>();foreach(var key in keys){switch(key){case "id":map[key]=item.Id;break;case "title":map[key]=item.Title;break;case "price":map[key]=item.Price;break;case "stock":map[key]=item.Stock;break;default:return Results.BadRequest();}}return Results.Ok(map);
}
}
