using Accessibility;
using System;
using System.Collections.Generic;
using System.Text;
using System.Windows;
using System.Windows.Controls;
using System.Windows.Data;
using System.Windows.Documents;
using System.Windows.Input;
using System.Windows.Media;
using System.Windows.Media.Imaging;
using System.Windows.Navigation;
using System.Windows.Shapes;

namespace PathText
{
    /// <summary>
    /// Interaction logic for PathText.xaml
    /// </summary>
    public class PathTextControl
    {
        private TextBlock sourceTextBlock = null;

        private double x;
        private double y;
        private double radius;
        private double fromAngel;
        private double toAngel;

        public PathTextControl(double x, double y, double radius, double fromAngel, double toAngel, TextBlock sourceTextBlock)
        {
            
            this.x = x;
            this.y = y;
            this.radius = radius;
            this.fromAngel = fromAngel;
            this.toAngel = toAngel;

            this.sourceTextBlock = sourceTextBlock;

            Update();

        }

        private void Update()
        {

            Grid grid = sourceTextBlock.Parent as Grid;

            TextBlock[] textBlock = new TextBlock[sourceTextBlock.Text.Length];

            double textBlocksAngel = 0;

            for (int i = 0; i < sourceTextBlock.Text.Length; i++)
            {
                textBlock[i] = new TextBlock();
                textBlock[i].Text = sourceTextBlock.Text[i].ToString();
                textBlock[i].FontSize = sourceTextBlock.FontSize;
                textBlock[i].FontFamily = sourceTextBlock.FontFamily;
                textBlock[i].FontStretch = sourceTextBlock.FontStretch;
                textBlock[i].FontWeight = sourceTextBlock.FontWeight;
                textBlock[i].FontStyle = sourceTextBlock.FontStyle;
                textBlock[i].IsHitTestVisible = false;



                textBlock[i].Background = sourceTextBlock.Background;
                textBlock[i].Foreground = sourceTextBlock.Foreground;

                grid.Children.Add(textBlock[i]);

                textBlock[i].Measure(new Size(double.PositiveInfinity, double.PositiveInfinity)); 
                textBlocksAngel += textBlock[i].DesiredSize.Width / 5;

            }

            double angel = this.fromAngel - 90;

            angel += 25 / 2  - textBlocksAngel / 2;

            for (int i = 0; i < sourceTextBlock.Text.Length; i++)
            {
                //if (angel > this.toAngel - 90) break;


                double xP = radius * Math.Cos(angel / ((180 / Math.PI))) + x;
                double yP = radius * Math.Sin(angel / ((180 / Math.PI))) + y;



                TransformGroup group = new TransformGroup();

                RotateTransform rt = new RotateTransform();


                TranslateTransform tt = new TranslateTransform();
                tt.X = xP;
                tt.Y = yP;

                group.Children.Add(rt);
                group.Children.Add(tt);

                textBlock[i].RenderTransform = group;


                rt.Angle = angel + 97 - (textBlock[i].DesiredSize.Width);
                angel += textBlock[i].DesiredSize.Width / 5;

            }
            grid.Children.Remove(sourceTextBlock);

        }
    }
}
