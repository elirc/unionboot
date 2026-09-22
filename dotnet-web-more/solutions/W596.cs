// W596: Idempotent PATCH merge semantics / Idempotent string merge for description
namespace DotnetWeb;
public static class W596{

public static IResult Merge(IDictionary<string,string> state,JsonElement patch){
if(patch.ValueKind!=JsonValueKind.Object)return Results.BadRequest();foreach(var p in patch.EnumerateObject())if(p.Name!="description"||(p.Value.ValueKind!=JsonValueKind.String&&p.Value.ValueKind!=JsonValueKind.Null))return Results.BadRequest();foreach(var p in patch.EnumerateObject()){if(p.Value.ValueKind==JsonValueKind.Null)state.Remove(p.Name);else state[p.Name]=p.Value.GetString()!;}return Results.Ok(new Dictionary<string,string>(state));
}
}
