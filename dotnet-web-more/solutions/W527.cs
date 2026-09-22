// W527: Header propagation policies / Allowlist X-Experiment and baggage
namespace DotnetWeb;
public static class W527{

public static IHeaderDictionary Propagate(IHeaderDictionary incoming){
var result=new HeaderDictionary();foreach(var name in new[]{"X-Experiment","baggage"})if(incoming.TryGetValue(name,out var values))result[name]=new StringValues(values.ToArray());return result;
}
}
