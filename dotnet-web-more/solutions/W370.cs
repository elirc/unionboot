// W370: IRouteConstraint evaluation / Numeric range constraint 1..11
namespace DotnetWeb;
public static class W370{

public static IRouteConstraint Create(){
return new PredicateConstraint((key,values)=>values.TryGetValue(key,out var raw)&&long.TryParse(raw?.ToString(),out var n)&&n>=1&&n<=11);
}
}
