// W367: IRouteConstraint evaluation / Numeric range constraint 1..8
namespace DotnetWeb;
public static class W367{

public static IRouteConstraint Create(){
return new PredicateConstraint((key,values)=>values.TryGetValue(key,out var raw)&&long.TryParse(raw?.ToString(),out var n)&&n>=1&&n<=8);
}
}
