// W473: Sparse fieldset projection / Default fields price
namespace DotnetWeb;
public static class W473{
public sealed record Item(int Id,string Title,decimal Price,int Stock);
public static IResult Project(Item item,string? fields){throw new NotImplementedException("W473");}
}
