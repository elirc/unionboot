// W530: Header propagation policies / Allowlist X-Workspace and baggage
namespace DotnetWeb;
public static class W530{

public static IHeaderDictionary Propagate(IHeaderDictionary incoming){
var result=new HeaderDictionary();foreach(var name in new[]{"X-Workspace","baggage"})if(incoming.TryGetValue(name,out var values))result[name]=new StringValues(values.ToArray());return result;
}
}
