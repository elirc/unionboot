// W362: IRouteConstraint evaluation / Numeric range constraint 1..3
namespace DotnetWeb;
public static class W362{

public static IRouteConstraint Create(){
return new PredicateConstraint((key,values)=>values.TryGetValue(key,out var raw)&&long.TryParse(raw?.ToString(),out var n)&&n>=1&&n<=3);
}
}
